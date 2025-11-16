"""Shared dependencies for auth routes."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.models import User
from app.services import security, user_store

from .schemas.auth import AuthSuccess
from .schemas.users import UserPayload


def token_expiry_seconds(expires_at: datetime) -> int:
    """Return the number of seconds until expiry."""
    expires = expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=UTC)
    remaining = expires - datetime.now(UTC)
    return max(0, int(remaining.total_seconds()))


async def issue_tokens(
    session: AsyncSession,
    user: User,
    settings: Settings,
) -> AuthSuccess:
    """Issue access and refresh tokens for the provided user."""
    access_token, access_exp = security.create_access_token(user, settings)
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


__all__ = ["issue_tokens", "token_expiry_seconds"]
