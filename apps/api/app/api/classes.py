"""Class management routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.models import ClassType
from app.services import class_store, user_store

from .schemas.classes import (
    ClassCreateRequest,
    ClassListResponse,
    ClassPayload,
    ClassStudentsResponse,
)
from .schemas.users import UserCreateRequest, UserCreateResponse, UserPayload, UserUpdateRequest

router = APIRouter(prefix="/classes", tags=["classes"])


@router.post("", response_model=ClassPayload, status_code=status.HTTP_201_CREATED)
async def create_class(
    payload: ClassCreateRequest,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> ClassPayload:
    """Create a new class for the authenticated teacher."""
    try:
        classroom = await class_store.create_class(
            session,
            teacher_id=actor.uid,
            grade=payload.grade,
            suffix=payload.suffix or "",
            class_type=ClassType.TEACHER,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    await session.commit()
    return ClassPayload.from_model(classroom, student_count=0)


@router.get("", response_model=ClassListResponse)
async def list_classes(
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> ClassListResponse:
    """List classes owned by the authenticated teacher."""
    classes = await class_store.list_classes_for_teacher(session, actor.uid)
    return ClassListResponse(
        classes=[
            ClassPayload.from_model(classroom, student_count=len(classroom.students))
            for classroom in classes
        ]
    )


@router.get("/{class_id}/students", response_model=ClassStudentsResponse)
async def list_class_students(
    class_id: str,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> ClassStudentsResponse:
    """Return the students belonging to a class."""
    classroom = await class_store.get_teacher_class_by_id(
        session, class_id=class_id, teacher_id=actor.uid
    )
    if classroom is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
        )
    return ClassStudentsResponse(
        classId=classroom.id,
        students=[UserPayload.from_model(student) for student in classroom.students],
    )


@router.post(
    "/{class_id}/students",
    response_model=UserCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_student_to_class(
    class_id: str,
    payload: UserCreateRequest,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> UserCreateResponse:
    """Create a student inside a specific class."""
    if payload.role != "student":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role"
        )

    classroom = await class_store.get_teacher_class_by_id(
        session, class_id=class_id, teacher_id=actor.uid
    )
    if classroom is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
        )

    existing = await user_store.get_user_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    user = await user_store.create_user(
        session,
        settings=settings,
        email=payload.email,
        password=payload.password,
        role="student",
        first_name=payload.first_name,
        last_name=payload.last_name,
        class_id=classroom.id,
        gender=payload.gender,
    )
    await session.commit()
    return UserCreateResponse(user=UserPayload.from_model(user))


@router.delete(
    "/{class_id}/students/{student_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_student_from_class(
    class_id: str,
    student_id: str,
    session: AsyncSession = Depends(get_db_session),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> Response:
    """Remove a student from a class the teacher owns."""
    classroom = await class_store.get_teacher_class_by_id(
        session, class_id=class_id, teacher_id=actor.uid
    )
    if classroom is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
        )

    student = await user_store.get_user_by_id(session, student_id)
    if student is None or student.role != "student" or student.class_id != classroom.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    await session.delete(student)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/{class_id}/students/{student_id}",
    response_model=UserPayload,
)
async def update_student_in_class(
    class_id: str,
    student_id: str,
    payload: UserUpdateRequest,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> UserPayload:
    """Update a student in a class the teacher owns."""
    classroom = await class_store.get_teacher_class_by_id(
        session, class_id=class_id, teacher_id=actor.uid
    )
    if classroom is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
        )

    student = await user_store.get_user_by_id(session, student_id)
    if student is None or student.role != "student" or student.class_id != classroom.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    # Check for email conflict if updating email
    if payload.email:
        existing = await user_store.get_user_by_email(session, payload.email)
        if existing and existing.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )

    updated_student = await user_store.update_user(
        session,
        user=student,
        settings=settings,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        gender=payload.gender,
    )
    await session.commit()
    return UserPayload.from_model(updated_student)


__all__ = ["router"]
