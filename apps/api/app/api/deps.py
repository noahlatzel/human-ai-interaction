"""Shared dependencies for auth routes."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.models import User, UserSession
from app.services import security, user_store

from .schemas.auth import AuthSuccess
from .schemas.users import UserPayload


def token_expiry_seconds(expires_at: datetime) -> int:
    """Return the number of seconds until expiry."""
    expires = expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    remaining = expires - datetime.now(timezone.utc)
    return max(0, int(remaining.total_seconds()))


async def issue_tokens(
    session: AsyncSession,
    user: User,
    settings: Settings,
    *,
    include_refresh: bool = True,
    session_id: str | None = None,
    learning_session_id: str | None = None,
    is_guest: bool | None = None,
) -> AuthSuccess:
    """Issue access (and optionally refresh) tokens for the provided user."""
    access_token, access_exp = security.create_access_token(
        user,
        settings,
        session_id=session_id,
        learning_session_id=learning_session_id,
        is_guest=is_guest,
    )
    refresh_token: str | None = None
    if include_refresh:
        refresh_token, refresh_exp = security.generate_refresh_token(settings)
        await user_store.create_refresh_token(session, user, refresh_token, refresh_exp)
    await session.flush()
    await session.refresh(user)
    return AuthSuccess(
        accessToken=access_token,
        refreshToken=refresh_token,
        expiresIn=token_expiry_seconds(access_exp),
        user=UserPayload.from_model(user),
    )


def set_session_cookie(
    response: Response, session_record: UserSession, settings: Settings
) -> None:
    """Set the opaque session cookie with secure defaults."""
    response.set_cookie(
        key=settings.session_cookie_name,
        value=session_record.id,
        max_age=token_expiry_seconds(session_record.expires_at),
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response: Response, settings: Settings) -> None:
    """Remove the session cookie."""
    response.delete_cookie(
        key=settings.session_cookie_name,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        path="/",
    )


__all__ = [
    "clear_session_cookie",
    "issue_tokens",
    "set_session_cookie",
    "token_expiry_seconds",
]
