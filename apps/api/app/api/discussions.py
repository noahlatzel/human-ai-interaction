from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db_session
from app.auth import get_current_user, AuthContext
from app.api.schemas import discussion as schemas
from app.services import discussion as crud

router = APIRouter()


@router.post("/", response_model=schemas.Discussion, status_code=status.HTTP_201_CREATED)
async def create_discussion(
    discussion: schemas.DiscussionCreate,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user)
):
    """Create a new discussion thread"""
    db_discussion = await crud.create_discussion(db, discussion=discussion, author_id=auth_context.user.id)
    
    # Add computed fields
    db_discussion.reply_count = 0
    db_discussion.is_subscribed = True  # Auto-subscribed on creation
    
    return db_discussion


@router.get("/", response_model=List[schemas.Discussion])
async def list_discussions(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user)
):
    """Get list of discussions, optionally filtered by category"""
    try:
        discussions = await crud.get_discussions(db, category=category, skip=skip, limit=limit)
        
        # Add computed fields
        for discussion in discussions:
            discussion.reply_count = await crud.get_reply_count(db, discussion.id)
            discussion.is_subscribed = await crud.is_subscribed(db, auth_context.user.id, discussion.id)
        
        return discussions
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{discussion_id}", response_model=schemas.DiscussionDetail)
async def get_discussion(
    discussion_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user)
):
    """Get a single discussion with all replies"""
    discussion = await crud.get_discussion_by_id(db, discussion_id)
    
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")
    
    # Add computed fields
    discussion.reply_count = len(discussion.replies)
    discussion.is_subscribed = await crud.is_subscribed(db, auth_context.user.id, discussion.id)
    
    return discussion


@router.post("/{discussion_id}/replies", response_model=schemas.DiscussionReply, status_code=status.HTTP_201_CREATED)
async def create_reply(
    discussion_id: int,
    reply: schemas.DiscussionReplyCreate,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user)
):
    """Add a reply to a discussion"""
    # Check if discussion exists
    discussion = await crud.get_discussion_by_id(db, discussion_id)
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")
    
    # Auto-subscribe user when they reply
    await crud.subscribe_to_discussion(db, user_id=auth_context.user.id, discussion_id=discussion_id)
    
    return await crud.create_reply(db, discussion_id=discussion_id, reply=reply, author_id=auth_context.user.id)


@router.post("/{discussion_id}/subscribe", status_code=status.HTTP_204_NO_CONTENT)
async def subscribe(
    discussion_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user)
):
    """Subscribe to a discussion to receive notifications"""
    discussion = await crud.get_discussion_by_id(db, discussion_id)
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")
    
    await crud.subscribe_to_discussion(db, user_id=auth_context.user.id, discussion_id=discussion_id)


@router.delete("/{discussion_id}/subscribe", status_code=status.HTTP_204_NO_CONTENT)
async def unsubscribe(
    discussion_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user)
):
    """Unsubscribe from a discussion"""
    await crud.unsubscribe_from_discussion(db, user_id=auth_context.user.id, discussion_id=discussion_id)
