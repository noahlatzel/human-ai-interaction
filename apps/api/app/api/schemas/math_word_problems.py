"""Schemas for mathematical word problems."""

from __future__ import annotations

from typing import cast

from pydantic import BaseModel, ConfigDict, Field

from app.api.schemas.math_analysis import Language, MathProblemAnalysis
from app.models import MathWordProblem


class MathWordProblemCreate(BaseModel):
    """Payload describing a new math word problem."""

    model_config = ConfigDict(populate_by_name=True)

    problem_text: str = Field(
        validation_alias="problemText",
        serialization_alias="problemText",
        min_length=1,
    )
    analysis: MathProblemAnalysis
    grade: int = Field(
        ge=3, le=4, description="Grade level (3 or 4) the problem targets."
    )
    language: Language = Field(default="en")


class MathWordProblemPayload(BaseModel):
    """Response payload describing a math word problem."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    problem_text: str = Field(
        validation_alias="problemText",
        serialization_alias="problemText",
    )
    analysis: MathProblemAnalysis
    grade: int
    language: Language
    difficulty_level: str = Field(
        validation_alias="difficultyLevel",
        serialization_alias="difficultyLevel",
    )

    @classmethod
    def from_model(cls, problem: MathWordProblem) -> "MathWordProblemPayload":
        """Create a payload from a model instance."""
        return cls(
            id=problem.id,
            problem_text=problem.problem_text,
            analysis=MathProblemAnalysis.model_validate(problem.analysis),
            grade=problem.grade,
            language=cast(Language, problem.language),
            difficulty_level=problem.difficulty_level,
        )


class MathWordProblemListResponse(BaseModel):
    """Envelope for returning multiple math word problems."""

    problems: list[MathWordProblemPayload]


__all__ = [
    "MathWordProblemCreate",
    "MathWordProblemListResponse",
    "MathWordProblemPayload",
]
