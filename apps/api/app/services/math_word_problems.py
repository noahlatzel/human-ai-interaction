"""Service helpers for mathematical word problems."""

from __future__ import annotations

from typing import Literal, Sequence
from uuid import uuid4

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import (
    DifficultyLevel,
    MathWordProblem,
    MathWordProblemOperation,
    MathematicalOperation,
)


def _normalize_difficulty(difficulty: DifficultyLevel | str) -> DifficultyLevel:
    """Return a valid DifficultyLevel."""
    try:
        return (
            difficulty
            if isinstance(difficulty, DifficultyLevel)
            else DifficultyLevel(difficulty)
        )
    except ValueError as exc:
        raise ValueError(
            "Difficulty must be one of: einfach, mittel, schwierig."
        ) from exc


def _normalize_operations(
    operations: Sequence[MathematicalOperation],
) -> list[MathematicalOperation]:
    """Return a de-duplicated list of operations preserving order."""
    seen: set[MathematicalOperation] = set()
    normalized: list[MathematicalOperation] = []
    for op in operations:
        operation = (
            op if isinstance(op, MathematicalOperation) else MathematicalOperation(op)
        )
        if operation not in seen:
            normalized.append(operation)
            seen.add(operation)
    if not normalized:
        raise ValueError("At least one operation is required.")
    return normalized


def _normalize_hints(hints: Sequence[str | None] | None) -> list[str | None]:
    """Trim, collapse blanks to None, limit to three hints."""
    if hints is None:
        return []
    if len(hints) > 3:
        raise ValueError("Hints are limited to three entries.")
    normalized: list[str | None] = []
    for hint in hints[:3]:
        if hint is None:
            normalized.append(None)
            continue
        trimmed = hint.strip()
        normalized.append(trimmed if trimmed else None)
    return normalized


async def create_problem(
    session: AsyncSession,
    *,
    problem_description: str,
    solution: str,
    difficulty: DifficultyLevel | str,
    operations: Sequence[MathematicalOperation],
    hints: Sequence[str | None] | None = None,
) -> MathWordProblem:
    """Create and persist a new math word problem."""
    normalized_difficulty = _normalize_difficulty(difficulty)
    normalized_ops = _normalize_operations(operations)
    normalized_hints = _normalize_hints(hints)
    problem = MathWordProblem(
        id=str(uuid4()),
        problem_description=problem_description,
        solution=solution,
        difficulty=normalized_difficulty,
        hint1=normalized_hints[0] if len(normalized_hints) > 0 else None,
        hint2=normalized_hints[1] if len(normalized_hints) > 1 else None,
        hint3=normalized_hints[2] if len(normalized_hints) > 2 else None,
        operations=[
            MathWordProblemOperation(operation=operation)
            for operation in normalized_ops
        ],
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
    operations: Sequence[MathematicalOperation] | None = None,
    difficulty_order: Literal["asc", "desc"] | None = None,
) -> list[MathWordProblem]:
    """Return all math word problems, optionally filtered by operations and sorted."""
    stmt = select(MathWordProblem).options(
        selectinload(MathWordProblem.operations),
    )

    if operations:
        normalized_ops = _normalize_operations(operations)
        op_values = [operation.value for operation in normalized_ops]
        assoc = MathWordProblemOperation
        op_column = assoc.operation
        stmt = (
            stmt.join(assoc)
            .group_by(MathWordProblem.id)
            .having(func.count(func.distinct(op_column)) == len(op_values))
            .having(
                func.sum(
                    case(
                        (op_column.in_(op_values), 1),
                        else_=0,
                    )
                )
                == len(op_values)
            )
        )

    if difficulty_order in {"asc", "desc"}:
        order_map = {
            DifficultyLevel.EINFACH: 1,
            DifficultyLevel.MITTEL: 2,
            DifficultyLevel.SCHWIERIG: 3,
        }
        order_expr = case(
            order_map, value=MathWordProblem.difficulty, else_=len(order_map) + 1
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
