"""Service helpers for mathematical word problems."""

from __future__ import annotations

from typing import Literal, Sequence
from uuid import uuid4

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import (
    MathWordProblem,
    MathWordProblemOperation,
    MathematicalOperation,
)


def _validate_difficulty(difficulty: float) -> None:
    """Ensure difficulty stays within the allowed range."""
    if not (1.0 <= difficulty <= 5.0):
        raise ValueError("Difficulty must be between 1 and 5.")


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


async def create_problem(
    session: AsyncSession,
    *,
    problem_description: str,
    solution: str,
    difficulty: float,
    operations: Sequence[MathematicalOperation],
) -> MathWordProblem:
    """Create and persist a new math word problem."""
    _validate_difficulty(difficulty)
    normalized_ops = _normalize_operations(operations)
    problem = MathWordProblem(
        id=str(uuid4()),
        problem_description=problem_description,
        solution=solution,
        difficulty=difficulty,
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

    if difficulty_order == "asc":
        stmt = stmt.order_by(MathWordProblem.difficulty.asc())
    elif difficulty_order == "desc":
        stmt = stmt.order_by(MathWordProblem.difficulty.desc())

    result = await session.execute(stmt)
    return list(result.scalars().unique().all())


__all__ = [
    "create_problem",
    "delete_problem_by_id",
    "list_problems",
]
