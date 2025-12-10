"""Schemas for class exercises."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.models import ClassExercise, ExerciseStatus, ExerciseType, format_timestamp
from .math_word_problems import MathWordProblemPayload


class ClassExercisePayload(BaseModel):
    """Public class exercise information."""

    id: str
    classId: str
    teacherId: str
    title: str
    topic: str
    description: str | None = None
    scheduledAt: str
    status: ExerciseStatus
    exerciseType: ExerciseType
    createdAt: str
    updatedAt: str
    problems: list[MathWordProblemPayload] = []

    @classmethod
    def from_model(cls, exercise: ClassExercise) -> "ClassExercisePayload":
        """Create a payload from a ClassExercise model."""
        return cls(
            id=exercise.id,
            classId=exercise.class_id,
            teacherId=exercise.teacher_id,
            title=exercise.title,
            topic=exercise.topic,
            description=exercise.description,
            scheduledAt=format_timestamp(exercise.scheduled_at),
            status=exercise.status,
            exerciseType=exercise.exercise_type,
            createdAt=format_timestamp(exercise.created_at),
            updatedAt=format_timestamp(exercise.updated_at),
            problems=[MathWordProblemPayload.from_model(p) for p in exercise.problems],
        )


class ClassExerciseCreateRequest(BaseModel):
    """Request to create a new class exercise."""

    classId: str
    title: str
    topic: str
    description: str | None = None
    scheduledAt: datetime
    problemIds: list[str] = Field(default_factory=list)
    exerciseType: ExerciseType = ExerciseType.CLASSROOM


class ClassExerciseUpdateRequest(BaseModel):
    """Request to update a class exercise."""

    title: str | None = None
    topic: str | None = None
    description: str | None = None
    scheduledAt: datetime | None = None
    status: ExerciseStatus | None = None
    problemIds: list[str] | None = None
    exerciseType: ExerciseType | None = None
