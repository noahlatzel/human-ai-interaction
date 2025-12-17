"""Routes for student own exercises."""

from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.api.schemas.student_own_exercises import (
    ImageProcessResponse,
    StudentOwnExerciseCreate,
    StudentOwnExerciseResponse,
    StudentOwnExerciseUpdate,
)
from app.dependencies import get_db_session
from app.models import OwnExerciseProgress
from app.services import student_own_exercise as service
from app.services.achievements import (
    check_and_unlock_achievements,
    increment_solved_count,
)

router = APIRouter()


@router.post(
    "",
    response_model=StudentOwnExerciseResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_student_exercise(
    data: StudentOwnExerciseCreate,
    actor: AuthContext = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db_session),
) -> StudentOwnExerciseResponse:
    """Create a new student own exercise."""
    exercise = await service.create_exercise(db, actor.uid, data)
    return StudentOwnExerciseResponse.model_validate(exercise)


@router.get("", response_model=list[StudentOwnExerciseResponse])
async def list_student_exercises(
    actor: AuthContext = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db_session),
) -> list[StudentOwnExerciseResponse]:
    """List all exercises for the current user."""
    exercises = await service.get_exercises_for_user(db, actor.uid)
    return [StudentOwnExerciseResponse.model_validate(ex) for ex in exercises]


@router.get("/solved", response_model=list[str])
async def get_solved_own_exercises(
    actor: AuthContext = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db_session),
) -> list[str]:
    """Return list of own exercise IDs that the student has successfully solved."""
    query = select(OwnExerciseProgress.exercise_id).where(
        OwnExerciseProgress.student_id == actor.uid,
        OwnExerciseProgress.success.is_(True),
    )
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("/{exercise_id}", response_model=StudentOwnExerciseResponse)
async def get_student_exercise(
    exercise_id: str,
    actor: AuthContext = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db_session),
) -> StudentOwnExerciseResponse:
    """Get a specific exercise by ID."""
    exercise = await service.get_exercise_by_id(db, exercise_id, actor.uid)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found",
        )
    return StudentOwnExerciseResponse.model_validate(exercise)


@router.patch("/{exercise_id}", response_model=StudentOwnExerciseResponse)
async def update_student_exercise(
    exercise_id: str,
    data: StudentOwnExerciseUpdate,
    actor: AuthContext = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db_session),
) -> StudentOwnExerciseResponse:
    """Update an existing exercise."""
    exercise = await service.update_exercise(db, exercise_id, actor.uid, data)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found",
        )
    return StudentOwnExerciseResponse.model_validate(exercise)


@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student_exercise(
    exercise_id: str,
    actor: AuthContext = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db_session),
) -> None:
    """Delete an exercise."""
    success = await service.delete_exercise(db, exercise_id, actor.uid)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found",
        )


class SolveExerciseRequest(BaseModel):
    """Request body for solving an exercise."""

    success: bool


class SolveExerciseResponse(BaseModel):
    """Response after solving an exercise."""

    message: str
    new_achievements: list[str] = []


@router.post("/{exercise_id}/solve", response_model=SolveExerciseResponse)
async def solve_student_exercise(
    exercise_id: str,
    data: SolveExerciseRequest,
    actor: AuthContext = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db_session),
) -> SolveExerciseResponse:
    """Track that a student solved their own exercise (only counts unique solves)."""
    # Verify the exercise exists and belongs to the user
    exercise = await service.get_exercise_by_id(db, exercise_id, actor.uid)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found",
        )

    new_achievements: list[str] = []

    # Only count successful solutions
    if data.success:
        # Check if this exercise was already solved successfully
        existing_stmt = select(OwnExerciseProgress).where(
            OwnExerciseProgress.student_id == actor.uid,
            OwnExerciseProgress.exercise_id == exercise_id,
        )
        result = await db.execute(existing_stmt)
        existing_progress = result.scalar_one_or_none()

        was_already_solved = existing_progress is not None and existing_progress.success

        # Create or update progress record
        if existing_progress:
            existing_progress.success = True
        else:
            new_progress = OwnExerciseProgress(
                id=str(uuid4()),
                exercise_id=exercise_id,
                student_id=actor.uid,
                success=True,
            )
            db.add(new_progress)

        # Only increment stats if this is a NEW successful solve
        if not was_already_solved:
            stats = await increment_solved_count(db, actor.uid, "own_exercises")
            # Check and unlock achievements
            unlocked = await check_and_unlock_achievements(db, actor.uid, stats)
            new_achievements = [a.id for a in unlocked]

        await db.commit()

    return SolveExerciseResponse(
        message="Progress tracked" if data.success else "Solution recorded",
        new_achievements=new_achievements,
    )


@router.post("/process-image", response_model=ImageProcessResponse)
async def process_image(
    _actor: AuthContext = Depends(require_roles("student")),
    file: UploadFile = File(...),
) -> ImageProcessResponse:
    """Process an uploaded image and extract exercise data using OpenAI Vision."""
    # Read image bytes
    image_bytes = await file.read()
    
    # Process with OpenAI Vision API
    return await service.process_image_with_openai(image_bytes)


__all__ = ["router"]
