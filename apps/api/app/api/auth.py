"""Authentication routes."""

from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, get_optional_user
from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.services import security, user_store

from .deps import issue_tokens
from .schemas.auth import (
    AuthSuccess,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RefreshResponse,
    RegisterRequest,
)

router = APIRouter()


@router.post("/login", response_model=AuthSuccess)
async def login(
    payload: LoginRequest,
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

    tokens = await issue_tokens(session, user, settings)
    await session.commit()
    return tokens


@router.post(
    "/register", response_model=AuthSuccess, status_code=status.HTTP_201_CREATED
)
async def register(
    payload: RegisterRequest,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
    actor: AuthContext | None = Depends(get_optional_user),
) -> AuthSuccess:
    """Register a new teacher or student."""
    if payload.role == "teacher" and (actor is None or actor.role != "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    existing = await user_store.get_user_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    teacher_id = payload.teacher_id
    if payload.role == "student":
        if actor and actor.role == "teacher":
            teacher_id = actor.uid
        teacher_id = teacher_id or "solo-student"

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

    tokens = await issue_tokens(session, user, settings)
    await session.commit()
    return tokens


@router.post("/refresh", response_model=RefreshResponse)
async def refresh_tokens(
    payload: RefreshRequest,
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
    await user_store.delete_refresh_token(session, payload.refreshToken)
    auth_data = await issue_tokens(session, user, settings)
    await session.commit()
    return RefreshResponse(
        accessToken=auth_data.accessToken,
        expiresIn=auth_data.expiresIn,
        refreshToken=auth_data.refreshToken,
        user=auth_data.user,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    payload: LogoutRequest,
    session: AsyncSession = Depends(get_db_session),
) -> None:
    """Invalidate a refresh token."""
    if payload.refreshToken:
        await user_store.delete_refresh_token(session, payload.refreshToken)
        await session.commit()


__all__ = ["router"]
