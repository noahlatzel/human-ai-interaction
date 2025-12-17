"""Model for tracking student progress on their own exercises."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .student_own_exercise import StudentOwnExercise
    from .user import User


class OwnExerciseProgress(Base):
    """Per-student completion state for their own exercises."""

    __tablename__ = "own_exercise_progress"
    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "exercise_id",
            name="uq_own_exercise_progress_student_exercise",
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    exercise_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("student_own_exercises.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    success: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    exercise: Mapped["StudentOwnExercise"] = relationship(lazy="joined")
    student: Mapped["User"] = relationship(lazy="joined")


__all__ = ["OwnExerciseProgress"]
