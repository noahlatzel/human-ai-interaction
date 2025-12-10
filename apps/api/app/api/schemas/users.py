"""User-facing schemas."""

from __future__ import annotations

from typing import Literal, Optional, cast

from pydantic import BaseModel, ConfigDict, Field

from app.models import User, format_timestamp


class UserPayload(BaseModel):
    """Public user information returned to clients."""

    id: str
    email: Optional[str] = None
    role: Literal["admin", "teacher", "student"]
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    classId: Optional[str] = None
    classGrade: Optional[int] = None
    classLabel: Optional[str] = None
    createdAt: str
    updatedAt: str
    isGuest: bool = False
    xp: int = 0
    solvedTasks: int = 0
    gender: str = "male"

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
            classId=user.class_id,
            classGrade=user.classroom.grade if user.classroom else None,
            classLabel=user.classroom.label if user.classroom else None,
            createdAt=format_timestamp(user.created_at),
            updatedAt=format_timestamp(user.updated_at),
            isGuest=user.is_guest,
            xp=user.xp,
            solvedTasks=user.solved_tasks,
            gender=user.gender,
        )


class UserCreateRequest(BaseModel):
    """Payload describing a user to be created."""

    model_config = ConfigDict(populate_by_name=True)

    email: str
    password: str
    role: Literal["teacher", "student"]
    first_name: Optional[str] = Field(default=None, alias="firstName")
    last_name: Optional[str] = Field(default=None, alias="lastName")
    class_id: Optional[str] = Field(default=None, alias="classId")
    grade: Optional[int] = Field(
        default=None,
        ge=3,
        le=4,
        description="Grade required when classId is absent.",
    )
    gender: Literal["male", "female"] = Field(default="male")


class UserCreateResponse(BaseModel):
    """Response returned when creating a user via privileged endpoint."""

    user: UserPayload


class UserUpdateRequest(BaseModel):
    """Payload for updating user profile."""

    model_config = ConfigDict(populate_by_name=True)

    email: Optional[str] = None
    password: Optional[str] = None
    first_name: Optional[str] = Field(default=None, alias="firstName")
    last_name: Optional[str] = Field(default=None, alias="lastName")
    gender: Optional[Literal["male", "female"]] = None


class UserListResponse(BaseModel):
    """Response envelope containing multiple users."""

    users: list[UserPayload]


__all__ = [
    "UserPayload",
    "UserCreateRequest",
    "UserCreateResponse",
    "UserUpdateRequest",
    "UserListResponse",
]
