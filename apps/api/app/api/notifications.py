from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db_session
from app.auth import get_current_user, AuthContext
from app.api.schemas import discussion as schemas
from app.services import discussion as crud

router = APIRouter()


@router.get("/", response_model=List[schemas.Notification])
async def get_notifications(
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Get user's notifications"""
    return await crud.get_user_notifications(
        db, user_id=auth_context.user.id, unread_only=unread_only
    )


@router.get("/unread-count")
async def get_unread_count(
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Get count of unread notifications"""
    count = await crud.get_unread_count(db, user_id=auth_context.user.id)
    return {"count": count}
