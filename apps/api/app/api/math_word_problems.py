"""Routes for managing mathematical word problems."""

from __future__ import annotations

from typing import Literal, cast

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, get_optional_user, require_roles
from app.dependencies import get_db_session
from app.services import math_word_problems as math_service

from .schemas.math_word_problems import (
    MathWordProblemCreate,
    MathWordProblemListResponse,
    MathWordProblemPayload,
)

router = APIRouter(prefix="/math-problems", tags=["math-word-problems"])


@router.post(
    "",
    response_model=MathWordProblemPayload,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("teacher"))],
)
async def create_math_word_problem(
    payload: MathWordProblemCreate,
    session: AsyncSession = Depends(get_db_session),
) -> MathWordProblemPayload:
    """Create a new mathematical word problem."""
    try:
        analysis_payload = payload.analysis.model_dump(by_alias=True)
        problem = await math_service.create_problem(
            session,
            problem_text=payload.problem_text,
            analysis=analysis_payload,
            grade=payload.grade,
            language=payload.language,
            difficulty_level=payload.analysis.difficulty_level,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    await session.commit()
    return MathWordProblemPayload.from_model(problem)


@router.delete(
    "/{problem_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_roles("teacher"))],
)
async def delete_math_word_problem(
    problem_id: str,
    session: AsyncSession = Depends(get_db_session),
) -> None:
    """Delete an existing mathematical word problem."""
    deleted = await math_service.delete_problem_by_id(session, problem_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found"
        )
    await session.commit()


@router.get("", response_model=MathWordProblemListResponse)
async def list_math_word_problems(
    difficulty_order: str | None = Query(
        default=None, alias="difficultyOrder", description="asc or desc"
    ),
    difficulty_level: str | None = Query(
        default=None, alias="difficultyLevel", description="easy, medium, or hard"
    ),
    grade: int | None = Query(
        default=None, description="Optional grade filter (3 or 4)"
    ),
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext | None = Depends(get_optional_user),
) -> MathWordProblemListResponse:
    """Return all mathematical word problems with optional filters."""
    normalized_order: Literal["asc", "desc"] | None = None
    if difficulty_order:
        lowered = difficulty_order.lower()
        if lowered not in ("asc", "desc"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="difficultyOrder must be 'asc' or 'desc'",
            )
        normalized_order = cast(Literal["asc", "desc"], lowered)

    resolved_grade = grade
    if resolved_grade is None and actor and actor.user.classroom:
        resolved_grade = actor.user.classroom.grade

    try:
        problems = await math_service.list_problems(
            session,
            difficulty_order=normalized_order,
            grade=resolved_grade,
            difficulty_level=difficulty_level,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return MathWordProblemListResponse(
        problems=[MathWordProblemPayload.from_model(problem) for problem in problems]
    )


__all__ = ["router"]
