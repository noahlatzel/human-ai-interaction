"""Seed helpers for math word problems."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import MathWordProblem
from app.services.math_seed_data import TEST_EXERCISES


def _resolve_difficulty(entry: dict[str, Any]) -> str:
    analysis = entry.get("analysis", {})
    return entry.get("difficulty_level") or analysis.get("difficultyLevel", "")


async def ensure_seed_math_problems(session: AsyncSession) -> None:
    """Seed math word problems if the table is empty."""
    result = await session.execute(select(func.count()).select_from(MathWordProblem))
    if result.scalar_one() > 0:
        return

    problems = []
    for entry in TEST_EXERCISES:
        difficulty_level = _resolve_difficulty(entry)
        problems.append(
            MathWordProblem(
                id=str(uuid4()),
                problem_text=entry["problem_text"],
                analysis=entry["analysis"],
                grade=entry.get("grade", 3),
                language=entry.get("language", "en"),
                difficulty_level=difficulty_level,
            )
        )

    if problems:
        session.add_all(problems)


__all__ = ["ensure_seed_math_problems"]
