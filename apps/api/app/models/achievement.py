"""User achievement model for tracking unlocked achievements."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .user import User


class UserAchievement(Base):
    """Record of an achievement unlocked by a user."""

    __tablename__ = "user_achievements"
    __table_args__ = (
        Index("ix_user_achievements_user_achievement", "user_id", "achievement_id", unique=True),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    achievement_id: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        index=True,
    )
    unlocked_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )

    # Relationship
    user: Mapped["User"] = relationship(back_populates="achievements", lazy="joined")


__all__ = ["UserAchievement"]
