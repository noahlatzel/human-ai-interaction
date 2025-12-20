"""Model for tracking student progress on math word problems."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .math import MathWordProblem
    from .user import User


class MathWordProblemProgress(Base):
    """Per-student completion state for math word problems."""

    __tablename__ = "math_word_problem_progress"
    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "math_word_problem_id",
            name="uq_math_word_problem_progress_student_problem",
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    math_word_problem_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("math_word_problems.id", ondelete="CASCADE"),
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
    attempt_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    problem: Mapped["MathWordProblem"] = relationship(lazy="joined")
    student: Mapped["User"] = relationship(lazy="joined")


__all__ = ["MathWordProblemProgress"]
