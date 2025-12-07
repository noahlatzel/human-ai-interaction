"""User management routes for privileged callers."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.models import ClassType
from app.services import class_store, user_store
from .schemas.users import UserCreateRequest, UserCreateResponse, UserPayload

router = APIRouter()


@router.post(
    "/users", response_model=UserCreateResponse, status_code=status.HTTP_201_CREATED
)
async def create_user(
    payload: UserCreateRequest,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
    actor: AuthContext = Depends(require_roles("teacher")),
) -> UserCreateResponse:
    """Create a new user without issuing tokens or sessions."""
    if payload.role != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    existing = await user_store.get_user_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    if payload.class_id:
        classroom = await class_store.get_teacher_class_by_id(
            session, class_id=payload.class_id, teacher_id=actor.uid
        )
        if classroom is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Class not found"
            )
        class_id = classroom.id
    elif payload.grade is not None:
        try:
            system_class = await class_store.ensure_system_class(
                session, grade=payload.grade, class_type=ClassType.SOLO
            )
            class_id = system_class.id
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
            ) from exc
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="grade or classId is required",
        )

    user = await user_store.create_user(
        session,
        settings=settings,
        email=payload.email,
        password=payload.password,
        role=payload.role,
        first_name=payload.first_name,
        last_name=payload.last_name,
        class_id=class_id,
    )
    await session.commit()
    return UserCreateResponse(user=UserPayload.from_model(user))


__all__ = ["router"]
