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
from app.services import learning, security, sessions, user_store

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
    return (role if isinstance(role, str) else None, sub if isinstance(sub, str) else None)


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


async def _resolve_student_teacher_id(
    session: AsyncSession,
    candidate_teacher_id: str | None,
    caller_role: str | None,
    caller_id: str | None,
) -> str:
    """Return the teacher_id to persist for a student registration."""
    if caller_role == "teacher" and caller_id:
        return caller_id
    if candidate_teacher_id:
        teacher = await user_store.get_user_by_id(session, candidate_teacher_id)
        if teacher is None or teacher.role != "teacher":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Teacher not found",
            )
        return candidate_teacher_id
    return "solo-student"


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
        session, user, settings, include_refresh=not user.is_guest
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
    caller_role, caller_id, resolved_actor = await _resolve_registration_caller(
        actor, request, settings
    )

    if payload.role == "teacher" and caller_role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    existing = await user_store.get_user_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    teacher_id = payload.teacher_id
    if payload.role == "student":
        if resolved_actor and resolved_actor.role == "teacher":
            teacher_id = resolved_actor.uid
        else:
            teacher_id = await _resolve_student_teacher_id(
                session, teacher_id, caller_role, caller_id
            )

    user = await user_store.create_user(
        session,
        settings=settings,
        email=payload.email,
        password=payload.password,
        role=payload.role,
        first_name=payload.first_name,
        last_name=payload.last_name,
        teacher_id=teacher_id,
    )

    learning_session = await learning.start_learning_session(session, user)
    user_session = await sessions.create_user_session(
        session, settings, user, learning_session
    )
    tokens = await issue_tokens(session, user, settings)
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
    auth_data = await issue_tokens(session, user, settings)
    refresh_token = auth_data.refreshToken
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to issue refresh token",
        )

    # If a session cookie is present, refresh its expiry as well.
    session_id = request.cookies.get(settings.session_cookie_name)
    if session_id:
        validation = await sessions.validate_session(session, session_id, settings)
        if validation.user_session:
            user_session = validation.user_session
            set_session_cookie(response, user_session, settings)
        if validation.mutated:
            await session.flush()

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
    if payload.refreshToken:
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
    await session.commit()


__all__ = ["router"]
