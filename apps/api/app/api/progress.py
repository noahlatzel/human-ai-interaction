"""Routes for recording and reporting math word problem progress."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.dependencies import get_db_session
from app.models import MathWordProblem
from app.services import math_progress

from .schemas.progress import (
    ProgressPayload,
    ProgressSetRequest,
    ProgressSummaryResponse,
    StudentProgressSummary,
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
    actor: AuthContext = Depends(require_roles("teacher", "admin")),
    session: AsyncSession = Depends(get_db_session),
) -> ProgressSummaryResponse:
    """Return aggregate progress for students scoped by teacher or all students for admin."""
    teacher_id = None if actor.role == "admin" else actor.uid
    summary = await math_progress.summarize_progress(session, teacher_id=teacher_id)
    return ProgressSummaryResponse.model_validate(
        {
            "totalProblems": summary.total_problems,
            "students": [
                StudentProgressSummary.from_stats(stats) for stats in summary.students
            ],
        }
    )


__all__ = ["router"]
