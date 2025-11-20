"""Models for mathematical word problems."""

from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
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


class MathWordProblem(Base):
    """Persisted mathematical word problem with associated operations."""

    __tablename__ = "math_word_problems"
    __table_args__ = (
        CheckConstraint(
            "difficulty >= 1.0 AND difficulty <= 5.0",
            name="ck_math_word_problems_difficulty_range",
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    problem_description: Mapped[str] = mapped_column(
        "problem_description", Text, nullable=False
    )
    solution: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[float] = mapped_column(Float, nullable=False)
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
        Enum(MathematicalOperation, native_enum=False, validate_strings=True),
        nullable=False,
    )

    problem: Mapped[MathWordProblem] = relationship(back_populates="operations")


__all__ = [
    "MathWordProblem",
    "MathWordProblemOperation",
    "MathematicalOperation",
]
