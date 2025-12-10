"""Authentication request/response schemas."""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

from .users import UserPayload


class LoginRequest(BaseModel):
    """Credentials used to login."""

    email: str
    password: str


class RegisterRequest(BaseModel):
    """Payload used to register a new teacher or student."""

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
        description="Required for students when classId is not provided (3 or 4).",
    )
    gender: Literal["male", "female"] = Field(default="male")


class AuthSuccess(BaseModel):
    """Response returned when authentication succeeds."""

    accessToken: str
    refreshToken: Optional[str] = None
    expiresIn: int
    sessionId: Optional[str] = None
    learningSessionId: Optional[str] = None
    user: UserPayload


class RefreshRequest(BaseModel):
    """Payload describing the refresh token to rotate."""

    refreshToken: str


class RefreshResponse(BaseModel):
    """Response returned when tokens are refreshed."""

    accessToken: str
    expiresIn: int
    refreshToken: str
    user: UserPayload


class LogoutRequest(BaseModel):
    """Payload describing the refresh token to invalidate."""

    refreshToken: Optional[str] = None


class GuestLoginRequest(BaseModel):
    """Payload for guest entry."""

    firstName: str = Field(min_length=1, max_length=64)
    grade: int = Field(ge=3, le=4)


__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "AuthSuccess",
    "RefreshRequest",
    "RefreshResponse",
    "LogoutRequest",
    "GuestLoginRequest",
]
