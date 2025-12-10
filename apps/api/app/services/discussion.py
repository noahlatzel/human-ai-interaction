from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, desc, select, update
from sqlalchemy.orm import selectinload
from app.models import (
    Discussion,
    DiscussionReply,
    DiscussionSubscription,
    Notification,
    User,
)
from app.api.schemas.discussion import DiscussionCreate, DiscussionReplyCreate


# Discussion CRUD
async def create_discussion(
    db: AsyncSession, discussion: DiscussionCreate, author_id: str
) -> Discussion:
    """Create a new discussion and auto-subscribe the author"""
    db_discussion = Discussion(
        topic=discussion.topic,
        content=discussion.content,
        category=discussion.category,
        author_id=author_id,
    )
    db.add(db_discussion)
    await db.flush()  # Get the ID

    # Auto-subscribe author to their own discussion
    await subscribe_to_discussion(db, user_id=author_id, discussion_id=db_discussion.id)

    await db.commit()
    await db.refresh(db_discussion)
    # Load author for response
    await db.refresh(db_discussion, attribute_names=["author"])
    return db_discussion


async def get_discussions(
    db: AsyncSession, category: Optional[str] = None, skip: int = 0, limit: int = 20
) -> List[Discussion]:
    """Get list of discussions, optionally filtered by category"""
    query = select(Discussion).options(selectinload(Discussion.author))

    if category:
        query = query.filter(Discussion.category == category)

    query = query.order_by(desc(Discussion.updated_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def get_discussion_by_id(
    db: AsyncSession, discussion_id: int
) -> Optional[Discussion]:
    """Get a single discussion with all its replies"""
    query = (
        select(Discussion)
        .options(
            selectinload(Discussion.replies).selectinload(DiscussionReply.author),
            selectinload(Discussion.author),
        )
        .filter(Discussion.id == discussion_id)
    )

    result = await db.execute(query)
    return result.scalars().first()


async def get_reply_count(db: AsyncSession, discussion_id: int) -> int:
    """Get the number of replies for a discussion"""
    query = (
        select(func.count())
        .select_from(DiscussionReply)
        .filter(DiscussionReply.discussion_id == discussion_id)
    )
    result = await db.execute(query)
    return result.scalar()


# Reply CRUD
async def create_reply(
    db: AsyncSession, discussion_id: int, reply: DiscussionReplyCreate, author_id: str
) -> DiscussionReply:
    """Create a reply and notify subscribers"""
    db_reply = DiscussionReply(
        discussion_id=discussion_id, author_id=author_id, content=reply.content
    )
    db.add(db_reply)
    await db.flush()

    # Update discussion's updated_at timestamp
    discussion = await get_discussion_by_id(db, discussion_id)
    if discussion:
        discussion.updated_at = func.now()

    # Notify all subscribers (except the author of the reply)
    await create_reply_notifications(
        db, discussion_id=discussion_id, reply_id=db_reply.id, author_id=author_id
    )

    await db.commit()
    await db.refresh(db_reply)
    await db.refresh(db_reply, attribute_names=["author"])
    return db_reply


# Subscription CRUD
async def subscribe_to_discussion(
    db: AsyncSession, user_id: str, discussion_id: int
) -> DiscussionSubscription:
    """Subscribe a user to a discussion"""
    # Check if already subscribed
    query = select(DiscussionSubscription).filter(
        DiscussionSubscription.user_id == user_id,
        DiscussionSubscription.discussion_id == discussion_id,
    )
    result = await db.execute(query)
    existing = result.scalars().first()

    if existing:
        return existing

    subscription = DiscussionSubscription(user_id=user_id, discussion_id=discussion_id)
    db.add(subscription)
    await db.flush()
    await db.refresh(subscription)
    return subscription


async def unsubscribe_from_discussion(
    db: AsyncSession, user_id: str, discussion_id: int
) -> bool:
    """Unsubscribe a user from a discussion"""
    query = select(DiscussionSubscription).filter(
        DiscussionSubscription.user_id == user_id,
        DiscussionSubscription.discussion_id == discussion_id,
    )
    result = await db.execute(query)
    subscription = result.scalars().first()

    if subscription:
        await db.delete(subscription)
        await db.commit()
        return True
    return False


async def is_subscribed(db: AsyncSession, user_id: str, discussion_id: int) -> bool:
    """Check if a user is subscribed to a discussion"""
    query = select(DiscussionSubscription).filter(
        DiscussionSubscription.user_id == user_id,
        DiscussionSubscription.discussion_id == discussion_id,
    )
    result = await db.execute(query)
    return result.scalars().first() is not None


# Notification CRUD
async def create_reply_notifications(
    db: AsyncSession, discussion_id: int, reply_id: int, author_id: str
):
    """Create notifications for all subscribers when a new reply is posted"""

    # Get all subscribers except the reply author
    query = select(DiscussionSubscription).filter(
        DiscussionSubscription.discussion_id == discussion_id,
        DiscussionSubscription.user_id != author_id,
    )
    result = await db.execute(query)
    subscriptions = result.scalars().all()

    # Get discussion and author info
    discussion = await get_discussion_by_id(db, discussion_id)

    author_query = select(User).filter(User.id == author_id)
    author_result = await db.execute(author_query)
    author = author_result.scalars().first()

    if not discussion or not author:
        return

    author_name = (
        f"{author.first_name} {author.last_name}" if author.first_name else "Someone"
    )

    # Create notification for each subscriber
    for subscription in subscriptions:
        notification = Notification(
            user_id=subscription.user_id,
            type="new_reply",
            discussion_id=discussion_id,
            reply_id=reply_id,
            message=f"{author_name} replied to '{discussion.topic}'",
        )
        db.add(notification)

    # No commit here, let the caller commit (create_reply commits)


async def get_user_notifications(
    db: AsyncSession, user_id: str, unread_only: bool = False
) -> List[Notification]:
    """Get notifications for a user"""
    query = select(Notification).filter(Notification.user_id == user_id)

    if unread_only:
        query = query.filter(not Notification.is_read)

    query = query.order_by(desc(Notification.created_at))
    result = await db.execute(query)
    return result.scalars().all()


async def get_unread_count(db: AsyncSession, user_id: str) -> int:
    """Get count of unread notifications"""
    query = (
        select(func.count())
        .select_from(Notification)
        .filter(Notification.user_id == user_id, not Notification.is_read)
    )
    result = await db.execute(query)
    return result.scalar()


async def mark_notification_read(
    db: AsyncSession, notification_id: int, user_id: str
) -> Optional[Notification]:
    """Mark a notification as read"""
    query = select(Notification).filter(
        Notification.id == notification_id, Notification.user_id == user_id
    )
    result = await db.execute(query)
    notification = result.scalars().first()

    if notification:
        notification.is_read = True
        await db.commit()
        await db.refresh(notification)

    return notification


async def mark_all_notifications_read(db: AsyncSession, user_id: str):
    """Mark all notifications as read for a user"""
    stmt = (
        update(Notification)
        .where(Notification.user_id == user_id, not Notification.is_read)
        .values(is_read=True)
    )
    await db.execute(stmt)
    await db.commit()
