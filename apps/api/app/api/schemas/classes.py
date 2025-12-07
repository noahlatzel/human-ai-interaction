"""Schemas for classroom management endpoints."""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.models import Classroom, format_timestamp

from .users import UserPayload


class ClassCreateRequest(BaseModel):
    """Payload describing a new class."""

    grade: int = Field(ge=3, le=4)
    suffix: str | None = Field(default="", max_length=16)


class ClassPayload(BaseModel):
    """Representation of a classroom."""

    id: str
    grade: int
    suffix: str
    label: str
    studentCount: int
    createdAt: str
    updatedAt: str

    @classmethod
    def from_model(
        cls, classroom: Classroom, *, student_count: int | None = None
    ) -> "ClassPayload":
        """Create a payload from a Classroom model."""
        return cls(
            id=classroom.id,
            grade=classroom.grade,
            suffix=classroom.suffix,
            label=classroom.label,
            studentCount=student_count if student_count is not None else 0,
            createdAt=format_timestamp(classroom.created_at),
            updatedAt=format_timestamp(classroom.updated_at),
        )


class ClassListResponse(BaseModel):
    """Envelope of classes for a teacher."""

    classes: list[ClassPayload]


class ClassStudentsResponse(BaseModel):
    """Students belonging to a class."""

    classId: str
    students: list[UserPayload]


__all__ = [
    "ClassCreateRequest",
    "ClassListResponse",
    "ClassPayload",
    "ClassStudentsResponse",
]
