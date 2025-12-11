"""Learning session helpers."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import LearningSession, User


def _now() -> datetime:
    """Return timezone-aware now."""
    return datetime.now(timezone.utc)


async def end_open_learning_sessions(
    session: AsyncSession, user_id: str, ended_at: Optional[datetime] = None
) -> list[LearningSession]:
    """Mark any open learning sessions as ended."""
    end_time = ended_at or _now()
    result = await session.execute(
        select(LearningSession).where(
            LearningSession.user_id == user_id, LearningSession.ended_at.is_(None)
        )
    )
    records = list(result.scalars().all())
    for record in records:
        record.ended_at = end_time
    return records


async def start_learning_session(
    session: AsyncSession,
    user: User,
    started_at: Optional[datetime] = None,
) -> LearningSession:
    """Close any open sessions and start a new learning session."""
    now = started_at or _now()
    await end_open_learning_sessions(session, user.id, ended_at=now)
    record = LearningSession(id=str(uuid4()), user_id=user.id, started_at=now)
    session.add(record)
    await session.flush()
    return record


async def end_learning_session(
    session: AsyncSession, learning_session_id: str, ended_at: Optional[datetime] = None
) -> LearningSession | None:
    """End a specific learning session if it is still open."""
    record = await session.get(LearningSession, learning_session_id)
    if record and record.ended_at is None:
        record.ended_at = ended_at or _now()
    return record


async def end_latest_learning_session(
    session: AsyncSession, user_id: str
) -> LearningSession | None:
    """End the most recent learning session for a user, if any."""
    result = await session.execute(
        select(LearningSession)
        .where(LearningSession.user_id == user_id)
        .order_by(LearningSession.started_at.desc())
        .limit(1)
    )
    record = result.scalar_one_or_none()
    if record and record.ended_at is None:
        record.ended_at = _now()
    return record


__all__ = [
    "end_learning_session",
    "end_latest_learning_session",
    "end_open_learning_sessions",
    "start_learning_session",
]
