"""Service helpers for class exercises."""

from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import ClassExercise, ExerciseStatus, ExerciseType, MathWordProblem


async def get_exercises_for_class(
    session: AsyncSession, class_id: str, exercise_type: ExerciseType | None = None
) -> list[ClassExercise]:
    """Return all exercises for a specific class, optionally filtered by type."""
    stmt = (
        select(ClassExercise)
        .where(ClassExercise.class_id == class_id)
        .order_by(ClassExercise.scheduled_at.desc())
        .options(
            selectinload(ClassExercise.problems).selectinload(
                MathWordProblem.operations
            )
        )
    )
    if exercise_type is not None:
        stmt = stmt.where(ClassExercise.exercise_type == exercise_type)
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def get_exercise_by_id(
    session: AsyncSession, exercise_id: str
) -> ClassExercise | None:
    """Return a specific exercise by ID."""
    stmt = (
        select(ClassExercise)
        .where(ClassExercise.id == exercise_id)
        .options(
            selectinload(ClassExercise.problems).selectinload(
                MathWordProblem.operations
            )
        )
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def create_exercise(
    session: AsyncSession,
    *,
    class_id: str,
    teacher_id: str,
    title: str,
    topic: str,
    description: str | None = None,
    scheduled_at: datetime,
    problem_ids: list[str],
    exercise_type: ExerciseType = ExerciseType.CLASSROOM,
) -> ClassExercise:
    """Create a new class exercise."""
    exercise = ClassExercise(
        id=str(uuid4()),
        class_id=class_id,
        teacher_id=teacher_id,
        title=title,
        topic=topic,
        description=description,
        scheduled_at=scheduled_at,
        status=ExerciseStatus.OPEN,  # Default to open for now, or logic based on date
        exercise_type=exercise_type,
    )

    if problem_ids:
        stmt = select(MathWordProblem).where(MathWordProblem.id.in_(problem_ids))
        result = await session.execute(stmt)
        problems = list(result.scalars().all())
        exercise.problems = problems

    session.add(exercise)
    await session.flush()
    await session.refresh(exercise)
    return exercise


async def update_exercise(
    session: AsyncSession,
    exercise: ClassExercise,
    *,
    title: str | None = None,
    topic: str | None = None,
    description: str | None = None,
    scheduled_at: datetime | None = None,
    status: ExerciseStatus | None = None,
    problem_ids: list[str] | None = None,
) -> ClassExercise:
    """Update an existing exercise."""
    if title is not None:
        exercise.title = title
    if topic is not None:
        exercise.topic = topic
    if description is not None:
        exercise.description = description
    if scheduled_at is not None:
        exercise.scheduled_at = scheduled_at
    if status is not None:
        exercise.status = status

    if problem_ids is not None:
        stmt = select(MathWordProblem).where(MathWordProblem.id.in_(problem_ids))
        result = await session.execute(stmt)
        problems = list(result.scalars().all())
        exercise.problems = problems

    session.add(exercise)
    await session.flush()
    await session.refresh(exercise)
    return exercise


async def delete_exercise(session: AsyncSession, exercise: ClassExercise) -> None:
    """Delete an exercise."""
    await session.delete(exercise)


async def get_homework_problems_for_class(
    session: AsyncSession, class_id: str
) -> list[MathWordProblem]:
    """Return all unique problems from homework exercises for a specific class."""
    exercises = await get_exercises_for_class(
        session, class_id, exercise_type=ExerciseType.HOMEWORK
    )

    # Collect unique problems from all homework exercises
    seen_ids: set[str] = set()
    problems: list[MathWordProblem] = []
    for exercise in exercises:
        if exercise.status != ExerciseStatus.OPEN:
            continue  # Only include problems from open homework
        for problem in exercise.problems:
            if problem.id not in seen_ids:
                seen_ids.add(problem.id)
                problems.append(problem)

    return problems
