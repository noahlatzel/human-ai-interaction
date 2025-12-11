"""Models for mathematical word problems."""

from __future__ import annotations

import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow


class MathematicalOperation(str, enum.Enum):
    """Supported mathematical operations for word problems."""

    ADDITION = "addition"
    SUBTRACTION = "subtraction"
    MULTIPLICATION = "multiplication"
    DIVISION = "division"


class DifficultyLevel(str, enum.Enum):
    """Discrete difficulty levels for math word problems."""

    EINFACH = "einfach"
    MITTEL = "mittel"
    SCHWIERIG = "schwierig"


class MathWordProblem(Base):
    """Persisted mathematical word problem with associated operations."""

    __tablename__ = "math_word_problems"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    problem_description: Mapped[str] = mapped_column(
        "problem_description", Text, nullable=False
    )
    solution: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[DifficultyLevel] = mapped_column(
        Enum(
            DifficultyLevel,
            native_enum=False,
            validate_strings=True,
            values_callable=lambda enum: [choice.value for choice in enum],
        ),
        nullable=False,
    )
    grade: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    hint1: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    hint2: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    hint3: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    operations: Mapped[list["MathWordProblemOperation"]] = relationship(
        back_populates="problem",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="MathWordProblemOperation.operation",
    )


class MathWordProblemOperation(Base):
    """Association table mapping problems to their operations."""

    __tablename__ = "math_word_problem_operations"
    __table_args__ = (
        UniqueConstraint(
            "problem_id",
            "operation",
            name="uq_math_word_problem_operations_problem_operation",
        ),
        Index(
            "ix_math_word_problem_operations_operation",
            "operation",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    problem_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("math_word_problems.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    operation: Mapped[MathematicalOperation] = mapped_column(
        Enum(
            MathematicalOperation,
            native_enum=False,
            validate_strings=True,
            values_callable=lambda enum: [choice.value for choice in enum],
        ),
        nullable=False,
    )

    problem: Mapped[MathWordProblem] = relationship(back_populates="operations")


__all__ = [
    "MathWordProblem",
    "MathWordProblemOperation",
    "MathematicalOperation",
    "DifficultyLevel",
]
