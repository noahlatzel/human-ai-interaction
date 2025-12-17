"""Schemas for student own exercises."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class StudentOwnExerciseBase(BaseModel):
    """Base schema for student own exercise."""

    problem: str = Field(..., min_length=1)
    difficulty: str
    answer: float
    grade: Optional[str] = None
    question_type: Optional[str] = Field(None, serialization_alias="questionType")
    metric: Optional[str] = None
    steps: Optional[str] = None


class StudentOwnExerciseCreate(StudentOwnExerciseBase):
    """Schema for creating a student own exercise."""

    image_path: Optional[str] = Field(None, serialization_alias="imagePath")


class StudentOwnExerciseUpdate(BaseModel):
    """Schema for updating a student own exercise."""

    problem: Optional[str] = Field(None, min_length=1)
    difficulty: Optional[str] = None
    answer: Optional[float] = None
    grade: Optional[str] = None
    question_type: Optional[str] = Field(None, serialization_alias="questionType")
    metric: Optional[str] = None
    steps: Optional[str] = None
    image_path: Optional[str] = Field(None, serialization_alias="imagePath")


class StudentOwnExerciseResponse(StudentOwnExerciseBase):
    """Schema for student own exercise response."""

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: str
    user_id: str = Field(serialization_alias="userId")
    image_path: Optional[str] = Field(None, serialization_alias="imagePath")
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")


class ImageProcessResponse(BaseModel):
    """Schema for image process response (mock data)."""

    problem: str
    difficulty: str
    grade: str
    question_type: str = Field(serialization_alias="questionType")
    answer: float
    metric: str
    steps: str


__all__ = [
    "StudentOwnExerciseCreate",
    "StudentOwnExerciseUpdate",
    "StudentOwnExerciseResponse",
    "ImageProcessResponse",
]
