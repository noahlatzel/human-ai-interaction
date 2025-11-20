"""Learning session model capturing start/end timestamps."""

from __future__ import annotations

from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .session import UserSession
    from .user import User


class LearningSession(Base):
    """Logical learning session that tracks user activity windows."""

    __tablename__ = "learning_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship(back_populates="learning_sessions", lazy="joined")
    session: Mapped["UserSession"] = relationship(
        back_populates="learning_session", uselist=False, lazy="selectin"
    )


__all__ = ["LearningSession"]
