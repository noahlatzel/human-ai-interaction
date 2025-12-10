"""User session persistence and validation."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.models import LearningSession, User, UserSession
from app.services import learning, security


def _now() -> datetime:
    """Return timezone-aware now."""
    return datetime.now(timezone.utc)


async def revoke_active_sessions(
    session: AsyncSession, user_id: str, revoked_at: Optional[datetime] = None
) -> list[UserSession]:
    """Mark all active sessions for a user as revoked."""
    when = revoked_at or _now()
    result = await session.execute(
        select(UserSession).where(
            UserSession.user_id == user_id, UserSession.revoked_at.is_(None)
        )
    )
    records = list(result.scalars().all())
    for record in records:
        record.revoked_at = when
    return records


def _rolling_expiry(settings: Settings, absolute_expires_at: datetime) -> datetime:
    """Compute next rolling expiry capped by the absolute expiry."""
    next_expiry = _now() + timedelta(hours=settings.session_ttl_hours)
    if next_expiry.tzinfo is None:
        next_expiry = next_expiry.replace(tzinfo=timezone.utc)
    if absolute_expires_at.tzinfo is None:
        absolute_expires_at = absolute_expires_at.replace(tzinfo=timezone.utc)
    return min(next_expiry, absolute_expires_at)


async def create_user_session(
    session: AsyncSession,
    settings: Settings,
    user: User,
    learning_session: LearningSession,
) -> UserSession:
    """Create a new opaque user session and revoke existing ones."""
    now = _now()
    await revoke_active_sessions(session, user.id, revoked_at=now)
    absolute_expires_at = now + timedelta(hours=settings.session_absolute_ttl_hours)
    expires_at = min(
        absolute_expires_at, now + timedelta(hours=settings.session_ttl_hours)
    )
    record = UserSession(
        id=security.generate_session_id(),
        user_id=user.id,
        learning_session_id=learning_session.id,
        issued_at=now,
        expires_at=expires_at,
        absolute_expires_at=absolute_expires_at,
        last_seen_at=now,
    )
    session.add(record)
    await session.flush()
    return record


def _normalize_ts(timestamp: datetime) -> datetime:
    """Ensure timestamps are timezone-aware UTC."""
    if timestamp.tzinfo is None:
        return timestamp.replace(tzinfo=timezone.utc)
    return timestamp.astimezone(timezone.utc)


async def validate_session(
    db_session: AsyncSession, session_id: str, settings: Settings
) -> "SessionValidation":
    """Return session validation result with mutation flag."""
    record = await db_session.get(UserSession, session_id)
    if record is None:
        return SessionValidation.empty(mutated=False)

    now = _now()
    expires_at = _normalize_ts(record.expires_at)
    absolute_expires_at = _normalize_ts(record.absolute_expires_at)
    if record.revoked_at is not None or expires_at <= now or absolute_expires_at <= now:
        record.revoked_at = record.revoked_at or now
        await learning.end_learning_session(
            db_session, record.learning_session_id, ended_at=now
        )
        await db_session.flush()
        return SessionValidation.empty(mutated=True)

    record.last_seen_at = now
    record.expires_at = _rolling_expiry(settings, absolute_expires_at)
    await db_session.flush()
    return SessionValidation(user_session=record, user=record.user, mutated=True)


async def revoke_session_by_id(
    db_session: AsyncSession, session_id: str, revoked_at: Optional[datetime] = None
) -> UserSession | None:
    """Revoke a session if it exists."""
    record = await db_session.get(UserSession, session_id)
    if record is None:
        return None
    if record.revoked_at is None:
        record.revoked_at = revoked_at or _now()
    return record


@dataclass
class SessionValidation:
    """Result of validating an opaque session."""

    user_session: UserSession | None
    user: User | None
    mutated: bool

    @classmethod
    def empty(cls, mutated: bool = False) -> "SessionValidation":
        """Return an empty validation result."""
        return cls(user_session=None, user=None, mutated=mutated)


__all__ = [
    "SessionValidation",
    "create_user_session",
    "revoke_active_sessions",
    "revoke_session_by_id",
    "validate_session",
]
