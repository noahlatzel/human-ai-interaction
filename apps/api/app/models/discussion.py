"""Discussion forum models."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .user import User


class Discussion(Base):
    """Community discussion thread."""

    __tablename__ = "discussions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    topic: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    author_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    author: Mapped["User"] = relationship("User", back_populates="discussions")
    replies: Mapped[list["DiscussionReply"]] = relationship(
        "DiscussionReply", back_populates="discussion", cascade="all, delete-orphan"
    )
    subscriptions: Mapped[list["DiscussionSubscription"]] = relationship(
        "DiscussionSubscription",
        back_populates="discussion",
        cascade="all, delete-orphan",
    )


class DiscussionReply(Base):
    """Reply to a discussion thread."""

    __tablename__ = "discussion_replies"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    discussion_id: Mapped[int] = mapped_column(
        ForeignKey("discussions.id", ondelete="CASCADE"), nullable=False
    )
    author_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )

    discussion: Mapped["Discussion"] = relationship(
        "Discussion", back_populates="replies"
    )
    author: Mapped["User"] = relationship("User", back_populates="discussion_replies")


class DiscussionSubscription(Base):
    """Track which users are subscribed to which discussions."""

    __tablename__ = "discussion_subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    discussion_id: Mapped[int] = mapped_column(
        ForeignKey("discussions.id", ondelete="CASCADE"), nullable=False
    )
    subscribed_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )

    user: Mapped["User"] = relationship(
        "User", back_populates="discussion_subscriptions"
    )
    discussion: Mapped["Discussion"] = relationship(
        "Discussion", back_populates="subscriptions"
    )

    __table_args__ = (
        UniqueConstraint("user_id", "discussion_id", name="unique_user_discussion"),
    )


class Notification(Base):
    """User notifications for discussion activity."""

    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    discussion_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("discussions.id", ondelete="CASCADE"), nullable=True
    )
    reply_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("discussion_replies.id", ondelete="CASCADE"), nullable=True
    )
    message: Mapped[str] = mapped_column(String(500), nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="notifications")
