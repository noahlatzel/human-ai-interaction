"""Routes for managing class exercises."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles, get_current_user
from app.dependencies import get_db_session
from app.models import ExerciseType
from app.services import class_exercise, class_store
from .schemas.class_exercises import (
    ClassExerciseCreateRequest,
    ClassExercisePayload,
    ClassExerciseUpdateRequest,
)
from .schemas.math_word_problems import MathWordProblemPayload, MathWordProblemListResponse

router = APIRouter(prefix="/class-exercises", tags=["class-exercises"])


@router.get("", response_model=list[ClassExercisePayload])
async def list_exercises(
    classId: str | None = None,
    exerciseType: ExerciseType | None = Query(default=None, alias="exerciseType"),
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(get_current_user),
) -> list[ClassExercisePayload]:
    """List exercises. Teachers see exercises for their classes, students for their class."""
    if actor.role == "student":
        # Students can only see exercises for their own class
        user = await class_store.get_user_with_class(session, actor.uid)
        if not user or not user.class_id:
            return []
        exercises = await class_exercise.get_exercises_for_class(
            session, user.class_id, exercise_type=exerciseType
        )
        return [ClassExercisePayload.from_model(e) for e in exercises]
    
    elif actor.role == "teacher":
        if not classId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="classId is required for teachers",
            )
        # Verify teacher owns the class
        classroom = await class_store.get_teacher_class_by_id(
            session, class_id=classId, teacher_id=actor.uid
        )
        if not classroom:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
            )
        
        exercises = await class_exercise.get_exercises_for_class(
            session, classId, exercise_type=exerciseType
        )
        return [ClassExercisePayload.from_model(e) for e in exercises]
    
    return []


@router.get("/homework-problems", response_model=MathWordProblemListResponse)
async def get_homework_problems(
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(get_current_user),
) -> MathWordProblemListResponse:
    """Get all homework problems assigned to the student's class."""
    if actor.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access homework problems",
        )
    
    user = await class_store.get_user_with_class(session, actor.uid)
    if not user or not user.class_id:
        return MathWordProblemListResponse(problems=[])
    
    problems = await class_exercise.get_homework_problems_for_class(session, user.class_id)
    return MathWordProblemListResponse(
        problems=[MathWordProblemPayload.from_model(p) for p in problems]
    )


@router.post("", response_model=ClassExercisePayload, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    payload: ClassExerciseCreateRequest,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> ClassExercisePayload:
    """Create a new class exercise."""
    # Verify teacher owns the class
    classroom = await class_store.get_teacher_class_by_id(
        session, class_id=payload.classId, teacher_id=actor.uid
    )
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
        )

    exercise = await class_exercise.create_exercise(
        session,
        class_id=payload.classId,
        teacher_id=actor.uid,
        title=payload.title,
        topic=payload.topic,
        description=payload.description,
        scheduled_at=payload.scheduledAt,
        problem_ids=payload.problemIds,
        exercise_type=payload.exerciseType,
    )
    await session.commit()
    return ClassExercisePayload.from_model(exercise)


@router.get("/{exercise_id}", response_model=ClassExercisePayload)
async def get_exercise(
    exercise_id: str,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(get_current_user),
) -> ClassExercisePayload:
    """Get a specific exercise."""
    exercise = await class_exercise.get_exercise_by_id(session, exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found"
        )

    # Access control
    if actor.role == "student":
        user = await class_store.get_user_with_class(session, actor.uid)
        if not user or user.class_id != exercise.class_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    elif actor.role == "teacher":
        if exercise.teacher_id != actor.uid:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return ClassExercisePayload.from_model(exercise)


@router.patch("/{exercise_id}", response_model=ClassExercisePayload)
async def update_exercise(
    exercise_id: str,
    payload: ClassExerciseUpdateRequest,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> ClassExercisePayload:
    """Update an exercise."""
    exercise = await class_exercise.get_exercise_by_id(session, exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found"
        )

    if exercise.teacher_id != actor.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    updated = await class_exercise.update_exercise(
        session,
        exercise,
        title=payload.title,
        topic=payload.topic,
        description=payload.description,
        scheduled_at=payload.scheduledAt,
        status=payload.status,
        problem_ids=payload.problemIds,
    )
    await session.commit()
    return ClassExercisePayload.from_model(updated)


@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercise(
    exercise_id: str,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> None:
    """Delete an exercise."""
    exercise = await class_exercise.get_exercise_by_id(session, exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found"
        )

    if exercise.teacher_id != actor.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    await class_exercise.delete_exercise(session, exercise)
    await session.commit()
