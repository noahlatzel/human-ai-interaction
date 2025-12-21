"""Schemas for math word problem progress."""

from __future__ import annotations

from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.services.math_progress import StudentProgressStats
from app.services.streak import WeeklyActivityDay as WeeklyActivityDayData
from app.models import MathWordProblemProgress


# Source of the exercise being solved
ExerciseSource = Literal["home_practice", "class_exercises", "own_exercises"]


class ProgressSetRequest(BaseModel):
    """Request to set or update a student's progress for a problem."""

    model_config = ConfigDict(populate_by_name=True)

    math_word_problem_id: str = Field(alias="mathWordProblemId", min_length=1)
    success: bool
    source: Optional[ExerciseSource] = Field(
        default="home_practice",
        description="Source category of the exercise: home_practice, class_exercises, or own_exercises",
    )


class ProgressPayload(BaseModel):
    """Response payload for a single progress record."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    math_word_problem_id: str = Field(alias="mathWordProblemId")
    student_id: str = Field(alias="studentId")
    success: bool
    attempt_count: int = Field(alias="attemptCount")

    @classmethod
    def from_model(cls, record: MathWordProblemProgress) -> "ProgressPayload":
        """Create a payload from the ORM record."""
        return cls.model_validate(
            {
                "id": record.id,
                "mathWordProblemId": record.math_word_problem_id,
                "studentId": record.student_id,
                "success": record.success,
                "attemptCount": record.attempt_count,
            }
        )


class StudentProgressSummary(BaseModel):
    """Aggregate progress for a student."""

    model_config = ConfigDict(populate_by_name=True)

    student_id: str = Field(alias="studentId")
    class_id: Optional[str] = Field(alias="classId", default=None)
    class_grade: Optional[int] = Field(alias="classGrade", default=None)
    class_label: Optional[str] = Field(alias="classLabel", default=None)
    first_name: Optional[str] = Field(alias="firstName", default=None)
    last_name: Optional[str] = Field(alias="lastName", default=None)
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


class WeeklyActivityDay(BaseModel):
    """Single day in the weekly activity calendar."""

    model_config = ConfigDict(populate_by_name=True)

    date: date
    day_of_week: str = Field(alias="dayOfWeek")
    is_today: bool = Field(alias="isToday")
    has_activity: bool = Field(alias="hasActivity")

    @classmethod
    def from_data(cls, data: WeeklyActivityDayData) -> "WeeklyActivityDay":
        """Build schema from service dataclass."""
        return cls.model_validate(
            {
                "date": data.date,
                "dayOfWeek": data.day_of_week,
                "isToday": data.is_today,
                "hasActivity": data.has_activity,
            }
        )


class StreakResponse(BaseModel):
    """Response payload for user streak statistics."""

    model_config = ConfigDict(populate_by_name=True)

    current_streak: int = Field(alias="currentStreak")
    longest_streak: int = Field(alias="longestStreak")
    weekly_activity: list[WeeklyActivityDay] = Field(alias="weeklyActivity")
    activity_history: list[str] = Field(alias="activityHistory")


__all__ = [
    "ProgressPayload",
    "ProgressSetRequest",
    "ProgressSummaryResponse",
    "StudentProgressSummary",
    "StreakResponse",
    "WeeklyActivityDay",
]
