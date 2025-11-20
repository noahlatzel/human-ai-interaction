"""User-facing schemas."""

from __future__ import annotations

from typing import Literal, cast

from pydantic import BaseModel, ConfigDict, Field

from app.models import User, format_timestamp


class UserPayload(BaseModel):
    """Public user information returned to clients."""

    id: str
    email: str | None = None
    role: Literal["admin", "teacher", "student"]
    firstName: str | None = None
    lastName: str | None = None
    teacherId: str | None = None
    createdAt: str
    updatedAt: str
    isGuest: bool = False

    @classmethod
    def from_model(cls, user: User) -> "UserPayload":
        """Create a payload from a User model."""
        role = cast(Literal["admin", "teacher", "student"], user.role)
        return cls(
            id=user.id,
            email=user.email,
            role=role,
            firstName=user.first_name,
            lastName=user.last_name,
            teacherId=user.teacher_id,
            createdAt=format_timestamp(user.created_at),
            updatedAt=format_timestamp(user.updated_at),
            isGuest=user.is_guest,
        )


class UserCreateRequest(BaseModel):
    """Payload describing a user to be created."""

    model_config = ConfigDict(populate_by_name=True)

    email: str
    password: str
    role: Literal["teacher", "student"]
    first_name: str | None = Field(default=None, alias="firstName")
    last_name: str | None = Field(default=None, alias="lastName")
    teacher_id: str | None = Field(default=None, alias="teacherId")


class UserListResponse(BaseModel):
    """Response envelope containing multiple users."""

    users: list[UserPayload]


__all__ = ["UserPayload", "UserCreateRequest", "UserListResponse"]
