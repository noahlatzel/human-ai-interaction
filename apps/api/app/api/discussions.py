from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db_session
from app.auth import get_current_user, AuthContext
from app.api.schemas import discussion as schemas
from app.services import discussion as crud

router = APIRouter()


@router.post(
    "/", response_model=schemas.Discussion, status_code=status.HTTP_201_CREATED
)
async def create_discussion(
    discussion: schemas.DiscussionCreate,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Create a new discussion thread"""
    db_discussion = await crud.create_discussion(
        db, discussion=discussion, author_id=auth_context.user.id
    )

    # Return with computed fields
    return schemas.Discussion.model_validate(
        {
            **db_discussion.__dict__,
            "reply_count": 0,
            "is_subscribed": True,  # Auto-subscribed on creation
        }
    )


@router.get("/", response_model=List[schemas.Discussion])
async def list_discussions(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Get list of discussions, optionally filtered by category and user role"""
    try:
        # Teachers see only discussions from their students
        if auth_context.user.role == "teacher":
            discussions = await crud.get_discussions_for_teacher(
                db,
                teacher_id=auth_context.user.id,
                category=category,
                skip=skip,
                limit=limit,
            )
        else:
            discussions = await crud.get_discussions(
                db, category=category, skip=skip, limit=limit
            )

        # Add computed fields
        result = []
        for discussion in discussions:
            reply_count = await crud.get_reply_count(db, discussion.id)
            is_subscribed = await crud.is_subscribed(
                db, auth_context.user.id, discussion.id
            )
            result.append(
                schemas.Discussion.model_validate(
                    {
                        **discussion.__dict__,
                        "reply_count": reply_count,
                        "is_subscribed": is_subscribed,
                    }
                )
            )

        return result
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{discussion_id}", response_model=schemas.DiscussionDetail)
async def get_discussion(
    discussion_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Get a single discussion with all replies"""
    discussion = await crud.get_discussion_by_id(db, discussion_id)

    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    # Return with computed fields
    is_subscribed = await crud.is_subscribed(db, auth_context.user.id, discussion.id)
    return schemas.DiscussionDetail.model_validate(
        {
            **discussion.__dict__,
            "reply_count": len(discussion.replies),
            "is_subscribed": is_subscribed,
        }
    )


@router.post(
    "/{discussion_id}/replies",
    response_model=schemas.DiscussionReply,
    status_code=status.HTTP_201_CREATED,
)
async def create_reply(
    discussion_id: int,
    reply: schemas.DiscussionReplyCreate,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Add a reply to a discussion"""
    # Check if discussion exists
    discussion = await crud.get_discussion_by_id(db, discussion_id)
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    # Auto-subscribe user when they reply
    await crud.subscribe_to_discussion(
        db, user_id=auth_context.user.id, discussion_id=discussion_id
    )

    return await crud.create_reply(
        db, discussion_id=discussion_id, reply=reply, author_id=auth_context.user.id
    )


@router.post("/{discussion_id}/subscribe", status_code=status.HTTP_204_NO_CONTENT)
async def subscribe(
    discussion_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Subscribe to a discussion to receive notifications"""
    discussion = await crud.get_discussion_by_id(db, discussion_id)
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    await crud.subscribe_to_discussion(
        db, user_id=auth_context.user.id, discussion_id=discussion_id
    )


@router.delete("/{discussion_id}/subscribe", status_code=status.HTTP_204_NO_CONTENT)
async def unsubscribe(
    discussion_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Unsubscribe from a discussion"""
    await crud.unsubscribe_from_discussion(
        db, user_id=auth_context.user.id, discussion_id=discussion_id
    )


@router.delete("/{discussion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_discussion(
    discussion_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Delete a discussion (teachers can delete any, users only their own)"""
    discussion = await crud.get_discussion_by_id(db, discussion_id)
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")

    # Teachers can delete any discussion, users only their own
    if (
        auth_context.user.role != "teacher"
        and discussion.author_id != auth_context.user.id
    ):
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this discussion"
        )

    await crud.delete_discussion(db, discussion_id)


@router.delete(
    "/{discussion_id}/replies/{reply_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_reply(
    discussion_id: int,
    reply_id: int,
    db: AsyncSession = Depends(get_db_session),
    auth_context: AuthContext = Depends(get_current_user),
):
    """Delete a reply (teachers can delete any, users only their own)"""
    reply = await crud.get_reply_by_id(db, reply_id)
    if not reply or reply.discussion_id != discussion_id:
        raise HTTPException(status_code=404, detail="Reply not found")

    # Teachers can delete any reply, users only their own
    if auth_context.user.role != "teacher" and reply.author_id != auth_context.user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this reply"
        )

    await crud.delete_reply(db, reply_id)
