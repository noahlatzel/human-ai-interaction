"""User statistics model for tracking solved exercises by category."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user import User


class UserStatistics(Base):
    """Statistics for a user's solved exercises by category."""

    __tablename__ = "user_statistics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Solved counts by category
    home_practice_solved: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False
    )
    class_exercises_solved: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False
    )
    own_exercises_solved: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False
    )
    total_solved: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationship
    user: Mapped["User"] = relationship(back_populates="statistics", lazy="joined")


__all__ = ["UserStatistics"]
