"""Schemas for math word problem progress."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.services.math_progress import StudentProgressStats
from app.models import MathWordProblemProgress


class ProgressSetRequest(BaseModel):
    """Request to set or update a student's progress for a problem."""

    model_config = ConfigDict(populate_by_name=True)

    math_word_problem_id: str = Field(alias="mathWordProblemId", min_length=1)
    success: bool


class ProgressPayload(BaseModel):
    """Response payload for a single progress record."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    math_word_problem_id: str = Field(alias="mathWordProblemId")
    student_id: str = Field(alias="studentId")
    success: bool

    @classmethod
    def from_model(cls, record: MathWordProblemProgress) -> "ProgressPayload":
        """Create a payload from the ORM record."""
        return cls.model_validate(
            {
                "id": record.id,
                "mathWordProblemId": record.math_word_problem_id,
                "studentId": record.student_id,
                "success": record.success,
            }
        )


class StudentProgressSummary(BaseModel):
    """Aggregate progress for a student."""

    model_config = ConfigDict(populate_by_name=True)

    student_id: str = Field(alias="studentId")
    class_id: str | None = Field(alias="classId", default=None)
    class_grade: int | None = Field(alias="classGrade", default=None)
    class_label: str | None = Field(alias="classLabel", default=None)
    first_name: str | None = Field(alias="firstName", default=None)
    last_name: str | None = Field(alias="lastName", default=None)
    solved: int
    total_problems: int = Field(alias="totalProblems")
    completion_rate: float = Field(alias="completionRate")

    @classmethod
    def from_stats(cls, stats: StudentProgressStats) -> "StudentProgressSummary":
        """Build a summary payload from service aggregates."""
        return cls.model_validate(
            {
                "studentId": stats.student_id,
                "classId": stats.class_id,
                "classGrade": stats.class_grade,
                "classLabel": stats.class_label,
                "firstName": stats.first_name,
                "lastName": stats.last_name,
                "solved": stats.solved,
                "totalProblems": stats.total_problems,
                "completionRate": stats.completion_rate,
            }
        )


class ProgressSummaryResponse(BaseModel):
    """Envelope for teacher/admin progress summaries."""

    model_config = ConfigDict(populate_by_name=True)

    total_problems: int = Field(alias="totalProblems")
    students: list[StudentProgressSummary]


__all__ = [
    "ProgressPayload",
    "ProgressSetRequest",
    "ProgressSummaryResponse",
    "StudentProgressSummary",
]
