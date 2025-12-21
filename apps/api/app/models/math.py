"""Models for mathematical word problems."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import (
    DateTime,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, utcnow


class MathWordProblem(Base):
    """Persisted mathematical word problem with analysis payload."""

    __tablename__ = "math_word_problems"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    problem_text: Mapped[str] = mapped_column(Text, nullable=False)
    analysis: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    grade: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    language: Mapped[str] = mapped_column(String(5), nullable=False, default="en")
    difficulty_level: Mapped[str] = mapped_column(
        String(10), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )


__all__ = [
    "MathWordProblem",
]
