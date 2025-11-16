"""ORM models for authentication."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, Optional
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    """Return a timezone-aware UTC timestamp."""
    return datetime.now(UTC)


class Base(DeclarativeBase):
    """Declarative base class for ORM models."""


class User(Base):
    """Application user account."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(
        String(160), unique=True, nullable=False, index=True
    )
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(64))
    last_name: Mapped[Optional[str]] = mapped_column(String(64))
    teacher_id: Mapped[Optional[str]] = mapped_column(String(64), index=True)
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

    def to_public_dict(self) -> dict[str, Any]:
        """Return a JSON-friendly representation of the user."""
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "teacherId": self.teacher_id,
            "createdAt": format_timestamp(self.created_at),
            "updatedAt": format_timestamp(self.updated_at),
        }


class UserRefreshToken(Base):
    """Refresh token persisted for each user."""

    __tablename__ = "user_refresh_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
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


def format_timestamp(value: datetime) -> str:
    """Serialize timestamps in ISO-8601 Zulu format."""
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")
