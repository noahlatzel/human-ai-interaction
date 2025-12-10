"""Models for class exercises (Klassenübungen)."""

from __future__ import annotations

import enum
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    String,
    Table,
    Column,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .classroom import Classroom
    from .user import User
    from .math import MathWordProblem


class ExerciseStatus(str, enum.Enum):
    """Status of a class exercise."""

    OPEN = "open"
    LOCKED = "locked"
    COMPLETED = "completed"


class ExerciseType(str, enum.Enum):
    """Type of exercise - homework (Zuhause üben) or classroom (Klassenübungen)."""

    HOMEWORK = "homework"
    CLASSROOM = "classroom"


# Association table for many-to-many relationship between ClassExercise and MathWordProblem
class_exercise_problems = Table(
    "class_exercise_problems",
    Base.metadata,
    Column(
        "class_exercise_id",
        String(36),
        ForeignKey("class_exercises.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "math_word_problem_id",
        String(36),
        ForeignKey("math_word_problems.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class ClassExercise(Base):
    """A practice session assigned to a class."""

    __tablename__ = "class_exercises"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    class_id: Mapped[str] = mapped_column(
        ForeignKey("classrooms.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    teacher_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    topic: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    scheduled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[ExerciseStatus] = mapped_column(
        Enum(ExerciseStatus), default=ExerciseStatus.OPEN, nullable=False
    )
    exercise_type: Mapped[ExerciseType] = mapped_column(
        Enum(ExerciseType), default=ExerciseType.CLASSROOM, nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    # Relationships
    classroom: Mapped["Classroom"] = relationship(lazy="joined")
    teacher: Mapped["User"] = relationship(lazy="joined")
    problems: Mapped[list["MathWordProblem"]] = relationship(
        secondary=class_exercise_problems,
        lazy="selectin",
    )
