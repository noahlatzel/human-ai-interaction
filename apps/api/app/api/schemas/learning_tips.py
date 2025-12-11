"""Pydantic schemas for learning tips."""

from pydantic import BaseModel, Field


class LearningTipCreate(BaseModel):
    """Schema for creating a new learning tip."""

    category: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)


class LearningTipUpdate(BaseModel):
    """Schema for updating an existing learning tip."""

    category: str | None = Field(None, min_length=1, max_length=50)
    title: str | None = Field(None, min_length=1, max_length=200)
    content: str | None = Field(None, min_length=1)


class LearningTipResponse(BaseModel):
    """Schema for learning tip response."""

    id: str
    teacher_id: str
    category: str
    title: str
    content: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


__all__ = ["LearningTipCreate", "LearningTipUpdate", "LearningTipResponse"]
