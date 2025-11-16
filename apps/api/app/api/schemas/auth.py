"""Authentication request/response schemas."""

from __future__ import annotations

from typing import Literal

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
    first_name: str | None = Field(default=None, alias="firstName")
    last_name: str | None = Field(default=None, alias="lastName")
    teacher_id: str | None = Field(
        default=None,
        alias="teacherId",
        description=(
            "Teacher ID a student should be assigned to. "
            "Teachers registering students ignore this value, and solo students can omit it."
        ),
    )


class AuthSuccess(BaseModel):
    """Response returned when authentication succeeds."""

    accessToken: str
    refreshToken: str
    expiresIn: int
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

    refreshToken: str | None = None


__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "AuthSuccess",
    "RefreshRequest",
    "RefreshResponse",
    "LogoutRequest",
]
