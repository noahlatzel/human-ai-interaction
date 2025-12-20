"""Service for student own exercises."""

from __future__ import annotations

from typing import Any, Optional
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.student_own_exercises import (
    StudentOwnExerciseCreate,
    StudentOwnExerciseUpdate,
)
from app.models import StudentOwnExercise


async def create_exercise(
    db: AsyncSession,
    user_id: str,
    data: StudentOwnExerciseCreate,
) -> StudentOwnExercise:
    """Create a new student own exercise."""
    analysis_payload = data.analysis.model_dump(by_alias=True)
    exercise = StudentOwnExercise(
        id=str(uuid4()),
        user_id=user_id,
        problem_text=data.problem_text,
        analysis=analysis_payload,
        language=data.language,
        difficulty_level=data.analysis.difficulty_level,
    )
    db.add(exercise)
    await db.commit()
    await db.refresh(exercise)
    return exercise


async def get_exercises_for_user(
    db: AsyncSession,
    user_id: str,
) -> list[StudentOwnExercise]:
    """Get all exercises for a user."""
    result = await db.execute(
        select(StudentOwnExercise)
        .where(StudentOwnExercise.user_id == user_id)
        .order_by(StudentOwnExercise.created_at.desc())
    )
    return list(result.scalars().all())


async def get_exercise_by_id(
    db: AsyncSession,
    exercise_id: str,
    user_id: str,
) -> Optional[StudentOwnExercise]:
    """Get a specific exercise by ID, verify ownership."""
    result = await db.execute(
        select(StudentOwnExercise).where(
            StudentOwnExercise.id == exercise_id,
            StudentOwnExercise.user_id == user_id,
        )
    )
    return result.scalar_one_or_none()


async def update_exercise(
    db: AsyncSession,
    exercise_id: str,
    user_id: str,
    data: StudentOwnExerciseUpdate,
) -> Optional[StudentOwnExercise]:
    """Update an exercise, verify ownership."""
    exercise = await get_exercise_by_id(db, exercise_id, user_id)
    if not exercise:
        return None

    update_data = data.model_dump(exclude_unset=True, exclude_none=True)
    if "analysis" in update_data:
        analysis: Any = update_data["analysis"]
        update_data["analysis"] = analysis.model_dump(by_alias=True)
        update_data["difficulty_level"] = analysis.difficulty_level

    for field, value in update_data.items():
        setattr(exercise, field, value)

    await db.commit()
    await db.refresh(exercise)
    return exercise


async def delete_exercise(
    db: AsyncSession,
    exercise_id: str,
    user_id: str,
) -> bool:
    """Delete an exercise, verify ownership."""
    exercise = await get_exercise_by_id(db, exercise_id, user_id)
    if not exercise:
        return False

    await db.delete(exercise)
    await db.commit()
    return True


__all__ = [
    "create_exercise",
    "get_exercises_for_user",
    "get_exercise_by_id",
    "update_exercise",
    "delete_exercise",
]
