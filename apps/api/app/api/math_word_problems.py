"""Routes for managing mathematical word problems."""

from __future__ import annotations

from typing import Literal, cast

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import require_roles
from app.dependencies import get_db_session
from app.models import MathematicalOperation
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
        problem = await math_service.create_problem(
            session,
            problem_description=payload.problem_description,
            solution=payload.solution,
            difficulty=payload.difficulty,
            operations=payload.operations,
            hints=payload.hints,
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
    operations: list[MathematicalOperation] = Query(
        default_factory=list, alias="operations"
    ),
    difficulty_order: str | None = Query(
        default=None, alias="difficultyOrder", description="asc or desc"
    ),
    session: AsyncSession = Depends(get_db_session),
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

    problems = await math_service.list_problems(
        session,
        operations=operations or None,
        difficulty_order=normalized_order,
    )
    return MathWordProblemListResponse(
        problems=[MathWordProblemPayload.from_model(problem) for problem in problems]
    )


__all__ = ["router"]
