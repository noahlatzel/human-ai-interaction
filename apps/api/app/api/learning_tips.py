"""Routes for managing learning tips."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.dependencies import get_db_session
from app.models import LearningTip, format_timestamp

from .schemas.learning_tips import (
    LearningTipCreate,
    LearningTipUpdate,
    LearningTipResponse,
)

router = APIRouter(prefix="/learning-tips", tags=["learning-tips"])


@router.post(
    "",
    response_model=LearningTipResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles("teacher"))],
)
async def create_learning_tip(
    payload: LearningTipCreate,
    actor: AuthContext = Depends(require_roles("teacher")),
    session: AsyncSession = Depends(get_db_session),
) -> LearningTipResponse:
    """Create a new learning tip."""
    tip = LearningTip(
        id=str(uuid.uuid4()),
        teacher_id=actor.user.id,
        category=payload.category,
        title=payload.title,
        content=payload.content,
    )
    session.add(tip)
    await session.commit()
    await session.refresh(tip)
    
    return LearningTipResponse(
        id=tip.id,
        teacher_id=tip.teacher_id,
        category=tip.category,
        title=tip.title,
        content=tip.content,
        created_at=format_timestamp(tip.created_at),
        updated_at=format_timestamp(tip.updated_at),
    )


@router.get("", response_model=list[LearningTipResponse])
async def list_learning_tips(
    actor: AuthContext = Depends(require_roles("teacher", "student")),
    session: AsyncSession = Depends(get_db_session),
) -> list[LearningTipResponse]:
    """List learning tips for the authenticated user."""
    # Students see tips from their teacher, teachers see their own tips
    if actor.user.role == "student":
        # Get student's classroom teacher's tips
        if not actor.user.classroom or not actor.user.classroom.teacher_id:
            return []
        query = select(LearningTip).where(
            LearningTip.teacher_id == actor.user.classroom.teacher_id
        )
    else:
        # Teachers see their own tips
        query = select(LearningTip).where(LearningTip.teacher_id == actor.user.id)
    
    result = await session.execute(query)
    tips = result.scalars().all()
    
    return [
        LearningTipResponse(
            id=tip.id,
            teacher_id=tip.teacher_id,
            category=tip.category,
            title=tip.title,
            content=tip.content,
            created_at=format_timestamp(tip.created_at),
            updated_at=format_timestamp(tip.updated_at),
        )
        for tip in tips
    ]


@router.put(
    "/{tip_id}",
    response_model=LearningTipResponse,
    dependencies=[Depends(require_roles("teacher"))],
)
async def update_learning_tip(
    tip_id: str,
    payload: LearningTipUpdate,
    actor: AuthContext = Depends(require_roles("teacher")),
    session: AsyncSession = Depends(get_db_session),
) -> LearningTipResponse:
    """Update an existing learning tip."""
    query = select(LearningTip).where(LearningTip.id == tip_id)
    result = await session.execute(query)
    tip = result.scalar_one_or_none()
    
    if not tip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning tip not found",
        )
    
    # Only the creator can update
    if tip.teacher_id != actor.user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own tips",
        )
    
    if payload.category is not None:
        tip.category = payload.category
    if payload.title is not None:
        tip.title = payload.title
    if payload.content is not None:
        tip.content = payload.content
    
    await session.commit()
    await session.refresh(tip)
    
    return LearningTipResponse(
        id=tip.id,
        teacher_id=tip.teacher_id,
        category=tip.category,
        title=tip.title,
        content=tip.content,
        created_at=format_timestamp(tip.created_at),
        updated_at=format_timestamp(tip.updated_at),
    )


@router.delete(
    "/{tip_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_roles("teacher"))],
)
async def delete_learning_tip(
    tip_id: str,
    actor: AuthContext = Depends(require_roles("teacher")),
    session: AsyncSession = Depends(get_db_session),
) -> None:
    """Delete an existing learning tip."""
    query = select(LearningTip).where(LearningTip.id == tip_id)
    result = await session.execute(query)
    tip = result.scalar_one_or_none()
    
    if not tip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning tip not found",
        )
    
    # Only the creator can delete
    if tip.teacher_id != actor.user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own tips",
        )
    
    await session.delete(tip)
    await session.commit()


__all__ = ["router"]
