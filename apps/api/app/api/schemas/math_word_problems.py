"""Schemas for mathematical word problems."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.models import MathWordProblem, MathematicalOperation


class MathWordProblemCreate(BaseModel):
    """Payload describing a new math word problem."""

    model_config = ConfigDict(populate_by_name=True)

    problem_description: str = Field(
        validation_alias="problemDescription",
        serialization_alias="problemDescription",
        min_length=1,
    )
    solution: str = Field(min_length=1)
    difficulty: float = Field(ge=1.0, le=5.0)
    operations: list[MathematicalOperation] = Field(min_length=1)


class MathWordProblemPayload(BaseModel):
    """Response payload describing a math word problem."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    problem_description: str = Field(
        validation_alias="problemDescription",
        serialization_alias="problemDescription",
    )
    solution: str
    difficulty: float
    operations: list[MathematicalOperation]

    @classmethod
    def from_model(cls, problem: MathWordProblem) -> "MathWordProblemPayload":
        """Create a payload from a model instance."""
        return cls(
            id=problem.id,
            problem_description=problem.problem_description,
            solution=problem.solution,
            difficulty=problem.difficulty,
            operations=[operation.operation for operation in problem.operations],
        )


class MathWordProblemListResponse(BaseModel):
    """Envelope for returning multiple math word problems."""

    problems: list[MathWordProblemPayload]


__all__ = [
    "MathWordProblemCreate",
    "MathWordProblemListResponse",
    "MathWordProblemPayload",
]
