"""Service helpers for mathematical word problems."""

from __future__ import annotations

from typing import Any, Literal
from uuid import uuid4

from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import MathWordProblem
from app.services.class_store import SUPPORTED_GRADES


def _normalize_grade(grade: int) -> int:
    """Validate and normalize grade for math problems."""
    if grade not in SUPPORTED_GRADES:
        raise ValueError(f"Grade must be one of {SUPPORTED_GRADES}.")
    return grade


def _normalize_difficulty_level(difficulty_level: str) -> str:
    """Validate difficulty level derived from analysis payload."""
    normalized = difficulty_level.strip().lower()
    if normalized not in {"easy", "medium", "hard"}:
        raise ValueError("difficultyLevel must be one of: easy, medium, hard.")
    return normalized


async def create_problem(
    session: AsyncSession,
    *,
    problem_text: str,
    analysis: dict[str, Any],
    grade: int,
    language: str,
    difficulty_level: str,
) -> MathWordProblem:
    """Create and persist a new math word problem."""
    normalized_difficulty_level = _normalize_difficulty_level(difficulty_level)
    normalized_grade = _normalize_grade(grade)
    problem = MathWordProblem(
        id=str(uuid4()),
        problem_text=problem_text,
        analysis=analysis,
        grade=normalized_grade,
        language=language,
        difficulty_level=normalized_difficulty_level,
    )
    session.add(problem)
    await session.flush()
    await session.refresh(problem)
    return problem


async def delete_problem_by_id(session: AsyncSession, problem_id: str) -> bool:
    """Delete a math word problem by id, returning True if it existed."""
    problem = await session.get(MathWordProblem, problem_id)
    if problem is None:
        return False
    await session.delete(problem)
    return True


async def list_problems(
    session: AsyncSession,
    *,
    difficulty_order: Literal["asc", "desc"] | None = None,
    grade: int | None = None,
    difficulty_level: str | None = None,
) -> list[MathWordProblem]:
    """Return all math word problems, optionally filtered and sorted."""
    stmt = select(MathWordProblem)
    if grade is not None:
        normalized_grade = _normalize_grade(grade)
        stmt = stmt.where(MathWordProblem.grade == normalized_grade)

    if difficulty_level:
        normalized_level = _normalize_difficulty_level(difficulty_level)
        stmt = stmt.where(MathWordProblem.difficulty_level == normalized_level)

    if difficulty_order in {"asc", "desc"}:
        order_map = {
            "easy": 1,
            "medium": 2,
            "hard": 3,
        }
        order_expr = case(
            order_map,
            value=MathWordProblem.difficulty_level,
            else_=len(order_map) + 1,
        )
        stmt = stmt.order_by(
            order_expr.asc() if difficulty_order == "asc" else order_expr.desc()
        )

    result = await session.execute(stmt)
    return list(result.scalars().unique().all())


__all__ = [
    "create_problem",
    "delete_problem_by_id",
    "list_problems",
]
