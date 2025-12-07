"""User and refresh token models."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional, TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, format_timestamp, utcnow

if TYPE_CHECKING:
    from .classroom import Classroom
    from .session import UserSession
    from .learning import LearningSession


class User(Base):
    """Application user account."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[Optional[str]] = mapped_column(
        String(160), unique=True, nullable=True, index=True
    )
    password_hash: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    role: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    is_guest: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(String(64))
    last_name: Mapped[Optional[str]] = mapped_column(String(64))
    class_id: Mapped[Optional[str]] = mapped_column(
        ForeignKey("classrooms.id", ondelete="SET NULL"), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    refresh_tokens: Mapped[list["UserRefreshToken"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    sessions: Mapped[list["UserSession"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    classroom: Mapped[Optional["Classroom"]] = relationship(
        "Classroom",
        back_populates="students",
        foreign_keys=[class_id],
        lazy="joined",
    )
    owned_classes: Mapped[list["Classroom"]] = relationship(
        "Classroom",
        back_populates="teacher",
        cascade="all, delete-orphan",
        foreign_keys="Classroom.teacher_id",
        lazy="selectin",
    )
    learning_sessions: Mapped[list["LearningSession"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def to_public_dict(self) -> dict[str, Any]:
        """Return a JSON-friendly representation of the user."""
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "classId": self.class_id,
            "classGrade": self.classroom.grade if self.classroom else None,
            "classLabel": self.classroom.label if self.classroom else None,
            "createdAt": format_timestamp(self.created_at),
            "updatedAt": format_timestamp(self.updated_at),
            "isGuest": self.is_guest,
        }


class UserRefreshToken(Base):
    """Refresh token persisted for each user."""

    __tablename__ = "user_refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token_hash: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    user: Mapped[User] = relationship(back_populates="refresh_tokens", lazy="joined")


__all__ = ["User", "UserRefreshToken"]
