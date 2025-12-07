"""Classroom model linking teachers, students, and grade context."""

from __future__ import annotations

import enum
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .user import User


class ClassType(str, enum.Enum):
    """Supported classroom types."""

    TEACHER = "teacher"
    SOLO = "solo"
    GUEST = "guest"


class Classroom(Base):
    """Class entity owned by a teacher and associated to students."""

    __tablename__ = "classrooms"
    __table_args__ = (
        UniqueConstraint(
            "teacher_id",
            "grade",
            "suffix",
            "class_type",
            name="uq_classrooms_owner_grade_suffix",
        ),
        Index("ix_classrooms_grade_class_type", "grade", "class_type"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    teacher_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    grade: Mapped[int] = mapped_column(Integer, nullable=False)
    suffix: Mapped[str] = mapped_column(String(16), default="", nullable=False)
    class_type: Mapped[ClassType] = mapped_column(
        Enum(
            ClassType,
            native_enum=False,
            validate_strings=True,
            values_callable=lambda enum: [choice.value for choice in enum],
        ),
        default=ClassType.TEACHER,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    teacher: Mapped[Optional["User"]] = relationship(
        back_populates="owned_classes",
        foreign_keys=[teacher_id],
        lazy="joined",
    )
    students: Mapped[list["User"]] = relationship(
        back_populates="classroom",
        foreign_keys="User.class_id",
        lazy="selectin",
    )

    @property
    def label(self) -> str:
        """Return a human-friendly class label (e.g., '3a')."""
        suffix = self.suffix.strip()
        return f"{self.grade}{suffix}" if suffix else str(self.grade)


__all__ = ["Classroom", "ClassType"]
