"""User management routes for privileged callers."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.services import user_store

from .auth import _resolve_student_teacher_id
from .schemas.users import UserCreateRequest, UserCreateResponse, UserPayload

router = APIRouter()


@router.post("/users", response_model=UserCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreateRequest,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
    actor: AuthContext = Depends(require_roles("admin", "teacher")),
) -> UserCreateResponse:
    """Create a new user without issuing tokens or sessions."""
    if payload.role == "teacher" and actor.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    existing = await user_store.get_user_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    teacher_id = payload.teacher_id
    if payload.role == "student":
        if actor.role == "teacher":
            teacher_id = actor.uid
        else:
            teacher_id = await _resolve_student_teacher_id(
                session, teacher_id, actor.role, actor.uid
            )

    user = await user_store.create_user(
        session,
        settings=settings,
        email=payload.email,
        password=payload.password,
        role=payload.role,
        first_name=payload.first_name,
        last_name=payload.last_name,
        teacher_id=teacher_id,
    )
    await session.commit()
    return UserCreateResponse(user=UserPayload.from_model(user))


__all__ = ["router"]
