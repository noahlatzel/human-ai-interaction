"""Routes for recording and reporting math word problem progress."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.dependencies import get_db_session
from app.models import MathWordProblem
from app.services import math_progress, streak

from .schemas.progress import (
    ProgressPayload,
    ProgressSetRequest,
    ProgressSummaryResponse,
    StudentProgressSummary,
    StreakResponse,
    WeeklyActivityDay,
)

router = APIRouter(prefix="/progress", tags=["progress"])


@router.post("", response_model=ProgressPayload, status_code=status.HTTP_200_OK)
async def set_math_progress(
    payload: ProgressSetRequest,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("student")),
) -> ProgressPayload:
    """Set or update the caller's progress for a specific math word problem."""
    problem = await session.get(MathWordProblem, payload.math_word_problem_id)
    if problem is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found"
        )

    record = await math_progress.set_progress(
        session,
        student_id=actor.uid,
        problem_id=payload.math_word_problem_id,
        success=payload.success,
    )
    await session.commit()
    return ProgressPayload.from_model(record)


@router.get(
    "/students",
    response_model=ProgressSummaryResponse,
)
async def get_student_progress_summary(
    actor: AuthContext = Depends(require_roles("teacher")),
    session: AsyncSession = Depends(get_db_session),
) -> ProgressSummaryResponse:
    """Return aggregate progress for students scoped by teacher or all students for admin."""
    summary = await math_progress.summarize_progress(session, teacher_id=actor.uid)
    return ProgressSummaryResponse.model_validate(
        {
            "totalProblems": summary.total_problems,
            "students": [
                StudentProgressSummary.from_stats(stats) for stats in summary.students
            ],
        }
    )


@router.get(
    "/streak",
    response_model=StreakResponse,
)
async def get_user_streak(
    actor: AuthContext = Depends(require_roles("student")),
    session: AsyncSession = Depends(get_db_session),
) -> StreakResponse:
    """Return current streak, longest streak, weekly activity, and full activity history for the authenticated student."""
    result = await streak.calculate_streak(session, actor.uid)
    return StreakResponse.model_validate(
        {
            "currentStreak": result.current_streak,
            "longestStreak": result.longest_streak,
            "weeklyActivity": [
                WeeklyActivityDay.from_data(day) for day in result.weekly_activity
            ],
            "activityHistory": result.activity_history,
        }
    )


__all__ = ["router"]
