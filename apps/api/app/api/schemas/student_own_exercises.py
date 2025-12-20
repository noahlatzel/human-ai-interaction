"""Schemas for student own exercises."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.api.schemas.math_analysis import Language, MathProblemAnalysis


class StudentOwnExerciseBase(BaseModel):
    """Base schema for student own exercise."""

    model_config = ConfigDict(populate_by_name=True)

    problem_text: str = Field(
        ...,
        min_length=1,
        validation_alias="problemText",
        serialization_alias="problemText",
    )
    analysis: MathProblemAnalysis
    language: Language = Field(default="en")


class StudentOwnExerciseCreate(StudentOwnExerciseBase):
    """Schema for creating a student own exercise."""


class StudentOwnExerciseUpdate(BaseModel):
    """Schema for updating a student own exercise."""

    model_config = ConfigDict(populate_by_name=True)

    problem_text: Optional[str] = Field(
        None,
        min_length=1,
        validation_alias="problemText",
        serialization_alias="problemText",
    )
    analysis: Optional[MathProblemAnalysis] = None
    language: Optional[Language] = None


class StudentOwnExerciseResponse(StudentOwnExerciseBase):
    """Schema for student own exercise response."""

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: str
    user_id: str = Field(serialization_alias="userId")
    difficulty_level: str = Field(
        validation_alias="difficultyLevel",
        serialization_alias="difficultyLevel",
    )
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


__all__ = [
    "StudentOwnExerciseCreate",
    "StudentOwnExerciseUpdate",
    "StudentOwnExerciseResponse",
]
