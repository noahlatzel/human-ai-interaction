"""Authentication routes."""

from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import (
    AuthContext,
    _extract_bearer_token,
    get_optional_user,
)
from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.models import ClassType
from app.services import class_store, learning, security, sessions, user_store

from .deps import clear_session_cookie, issue_tokens, set_session_cookie
from .schemas.auth import (
    AuthSuccess,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RefreshResponse,
    RegisterRequest,
)

router = APIRouter()


def _decode_bearer_claims(
    authorization_header: str | None, settings: Settings
) -> tuple[str | None, str | None]:
    """Decode a bearer token into (role, sub) when present."""
    if not authorization_header:
        return None, None
    try:
        payload = security.decode_access_token(
            _extract_bearer_token(authorization_header), settings
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        ) from exc
    role = payload.get("role")
    sub = payload.get("sub")
    return (
        role if isinstance(role, str) else None,
        sub if isinstance(sub, str) else None,
    )


async def _resolve_registration_caller(
    actor: AuthContext | None,
    request: Request,
    settings: Settings,
) -> tuple[str | None, str | None, AuthContext | None]:
    """Resolve caller role/id from middleware actor or bearer token claims."""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        role, sub = _decode_bearer_claims(auth_header, settings)
        if actor and actor.uid == sub:
            return actor.role, actor.uid, actor
        return role, sub, None
    if actor:
        return actor.role, actor.uid, actor
    return None, None, None


async def _resolve_registration_classroom(
    session: AsyncSession,
    payload: RegisterRequest,
    caller_role: str | None,
    caller_id: str | None,
) -> str | None:
    """Resolve the class a student should join during registration."""
    if payload.role != "student":
        return None
    if payload.class_id:
        classroom = await class_store.get_class_by_id(session, payload.class_id)
        if classroom is None or classroom.class_type != ClassType.TEACHER:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
            )
        if caller_role == "teacher" and caller_id and classroom.teacher_id != caller_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden"
            )
        return classroom.id
    if payload.grade is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="grade is required when classId is missing",
        )
    try:
        system_class = await class_store.ensure_system_class(
            session, grade=payload.grade, class_type=ClassType.SOLO
        )
        return system_class.id
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc


@router.post("/login", response_model=AuthSuccess)
async def login(
    payload: LoginRequest,
    response: Response,
    request: Request,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
) -> AuthSuccess:
    """Authenticate a user and return access/refresh tokens."""
    user = await user_store.get_user_by_email(session, payload.email)
    if user is None or not security.verify_password(
        payload.password, user.password_hash, settings
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    learning_session = await learning.start_learning_session(session, user)
    user_session = await sessions.create_user_session(
        session, settings, user, learning_session
    )
    tokens = await issue_tokens(
        session,
        user,
        settings,
        include_refresh=not user.is_guest,
        session_id=user_session.id,
        learning_session_id=learning_session.id,
        is_guest=user.is_guest,
    )
    set_session_cookie(response, user_session, settings)
    request.state.skip_session_cookie_refresh = True
    await session.commit()
    return tokens.model_copy(
        update={
            "sessionId": user_session.id,
            "learningSessionId": learning_session.id,
        }
    )


@router.post(
    "/register", response_model=AuthSuccess, status_code=status.HTTP_201_CREATED
)
async def register(
    payload: RegisterRequest,
    response: Response,
    request: Request,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
    actor: AuthContext | None = Depends(get_optional_user),
) -> AuthSuccess:
    """Register a new teacher or student."""
    caller_role, caller_id, _resolved_actor = await _resolve_registration_caller(
        actor, request, settings
    )

    existing = await user_store.get_user_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    if payload.role == "student" and caller_role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins cannot register students",
        )

    class_id = await _resolve_registration_classroom(
        session, payload, caller_role, caller_id
    )

    user = await user_store.create_user(
        session,
        settings=settings,
        email=payload.email,
        password=payload.password,
        role=payload.role,
        first_name=payload.first_name,
        last_name=payload.last_name,
        class_id=class_id,
    )

    learning_session = await learning.start_learning_session(session, user)
    user_session = await sessions.create_user_session(
        session, settings, user, learning_session
    )
    tokens = await issue_tokens(
        session,
        user,
        settings,
        session_id=user_session.id,
        learning_session_id=learning_session.id,
        is_guest=user.is_guest,
    )
    set_session_cookie(response, user_session, settings)
    request.state.skip_session_cookie_refresh = True
    await session.commit()
    return tokens.model_copy(
        update={
            "sessionId": user_session.id,
            "learningSessionId": learning_session.id,
        }
    )


@router.post("/refresh", response_model=RefreshResponse)
async def refresh_tokens(
    payload: RefreshRequest,
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
) -> RefreshResponse:
    """Refresh authentication tokens given a valid refresh token."""
    record = await user_store.find_refresh_token(session, payload.refreshToken)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    if expires_at <= datetime.now(UTC):
        await user_store.delete_refresh_token(session, payload.refreshToken)
        await session.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user = record.user
    if user.is_guest:
        await user_store.delete_refresh_token(session, payload.refreshToken)
        await session.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    await user_store.delete_refresh_token(session, payload.refreshToken)

    session_id = request.cookies.get(settings.session_cookie_name)
    validated_session = None
    if session_id:
        validation = await sessions.validate_session(session, session_id, settings)
        if validation.user_session and validation.user_session.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        if validation.user_session:
            validated_session = validation.user_session
            set_session_cookie(response, validation.user_session, settings)
        if validation.mutated:
            await session.flush()

    if validated_session is None:
        learning_session = await learning.start_learning_session(session, user)
        validated_session = await sessions.create_user_session(
            session, settings, user, learning_session
        )
        set_session_cookie(response, validated_session, settings)
    else:
        learning_session = validated_session.learning_session

    auth_data = await issue_tokens(
        session,
        user,
        settings,
        session_id=validated_session.id,
        learning_session_id=learning_session.id,
        is_guest=user.is_guest,
    )
    refresh_token = auth_data.refreshToken
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to issue refresh token",
        )

    await session.commit()
    return RefreshResponse(
        accessToken=auth_data.accessToken,
        expiresIn=auth_data.expiresIn,
        refreshToken=refresh_token,
        user=auth_data.user,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    payload: LogoutRequest,
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
) -> None:
    """Invalidate a refresh token."""
    refresh_record = None
    if payload.refreshToken:
        refresh_record = await user_store.find_refresh_token(
            session, payload.refreshToken
        )
        await user_store.delete_refresh_token(session, payload.refreshToken)
    session_id = request.cookies.get(settings.session_cookie_name)
    if session_id:
        user_session = await sessions.revoke_session_by_id(session, session_id)
        if user_session:
            await learning.end_learning_session(
                session, user_session.learning_session_id
            )
        clear_session_cookie(response, settings)
        request.state.skip_session_cookie_refresh = True
    elif refresh_record:
        await sessions.revoke_active_sessions(session, refresh_record.user_id)
        await learning.end_latest_learning_session(session, refresh_record.user_id)
    await session.commit()


__all__ = ["router"]
