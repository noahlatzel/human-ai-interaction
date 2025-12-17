"""Student-created own exercises model."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .user import User


def utcnow() -> datetime:
    """Return the current UTC time."""
    return datetime.utcnow()


class StudentOwnExercise(Base):
    """Student-created math word problem exercise."""

    __tablename__ = "student_own_exercises"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    problem: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False)
    answer: Mapped[float] = mapped_column(Float, nullable=False)
    grade: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    question_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    metric: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    steps: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    # Relationship
    user: Mapped[User] = relationship(back_populates="own_exercises")
