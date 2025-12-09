"""User persistence helpers."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.models import User, UserRefreshToken
from app.services import security


def _normalize_email(value: str) -> str:
    """Normalize email addresses for consistent lookups."""
    return value.strip().lower()


async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    """Return the user identified by email, if any."""
    if not email:
        return None
    stmt = select(User).where(User.email == _normalize_email(email))
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: str) -> Optional[User]:
    """Return the user identified by the ID, if any."""
    return await session.get(User, user_id)


async def create_user(
    session: AsyncSession,
    *,
    settings: Settings,
    email: str,
    password: str,
    role: str,
    first_name: str | None = None,
    last_name: str | None = None,
    class_id: str | None = None,
    is_guest: bool = False,
    gender: str = "male",
) -> User:
    """Create a new user with a hashed password."""
    normalized_email = _normalize_email(email)
    password_hash = security.hash_password(password, settings)
    user = User(
        id=str(uuid4()),
        email=normalized_email,
        password_hash=password_hash,
        role=role,
        is_guest=is_guest,
        first_name=first_name,
        last_name=last_name,
        class_id=class_id,
        gender=gender,
    )
    session.add(user)
    await session.flush()
    return user


async def ensure_admin_user(session: AsyncSession, settings: Settings) -> User:
    """Create the bootstrap admin account if it does not exist."""
    existing = await get_user_by_email(session, settings.admin_email)
    if existing:
        return existing
    return await create_user(
        session,
        settings=settings,
        email=settings.admin_email,
        password=settings.admin_password,
        role="admin",
        first_name="Admin",
        last_name="User",
    )


async def update_user(
    session: AsyncSession,
    user: User,
    *,
    settings: Settings,
    email: str | None = None,
    password: str | None = None,
    first_name: str | None = None,
    last_name: str | None = None,
    gender: str | None = None,
) -> User:
    """Update user fields. Only non-None values are applied."""
    if email is not None:
        user.email = _normalize_email(email)
    if password is not None:
        user.password_hash = security.hash_password(password, settings)
    if first_name is not None:
        user.first_name = first_name
    if last_name is not None:
        user.last_name = last_name
    if gender is not None:
        user.gender = gender
    user.updated_at = datetime.now(UTC)
    await session.flush()
    return user


async def touch_user_timestamp(session: AsyncSession, user_id: str) -> None:
    """Update the user's updated_at column."""
    user = await session.get(User, user_id)
    if user:
        user.updated_at = datetime.now(UTC)


async def create_refresh_token(
    session: AsyncSession,
    user: User,
    refresh_token: str,
    expires_at: datetime,
) -> UserRefreshToken:
    """Persist a hashed refresh token for the user."""
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    hashed = security.hash_refresh_token(refresh_token)
    record = UserRefreshToken(user_id=user.id, token_hash=hashed, expires_at=expires_at)
    session.add(record)
    return record


async def find_refresh_token(
    session: AsyncSession,
    refresh_token: str,
) -> Optional[UserRefreshToken]:
    """Return a refresh token record if it exists."""
    hashed = security.hash_refresh_token(refresh_token)
    stmt = select(UserRefreshToken).where(UserRefreshToken.token_hash == hashed)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def delete_refresh_token(session: AsyncSession, refresh_token: str) -> None:
    """Delete the refresh token if it exists."""
    hashed = security.hash_refresh_token(refresh_token)
    await session.execute(
        delete(UserRefreshToken).where(UserRefreshToken.token_hash == hashed)
    )


async def delete_user_refresh_tokens(session: AsyncSession, user_id: str) -> None:
    """Delete every refresh token associated with the provided user."""
    await session.execute(
        delete(UserRefreshToken).where(UserRefreshToken.user_id == user_id)
    )


async def create_guest_user(
    session: AsyncSession,
    *,
    first_name: str,
    class_id: str | None = None,
) -> User:
    """Create a guest student user with minimal attributes."""
    user = User(
        id=str(uuid4()),
        email=None,
        password_hash=None,
        role="student",
        is_guest=True,
        first_name=first_name,
        last_name=None,
        class_id=class_id,
    )
    session.add(user)
    await session.flush()
    return user
