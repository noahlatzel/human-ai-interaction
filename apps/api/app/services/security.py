"""Security helpers for password hashing and token generation."""

from __future__ import annotations

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any, cast

import bcrypt
import jwt

from app.config import Settings
from app.models import User


def _bcrypt_rounds(settings: Settings) -> int:
    """Return the desired bcrypt work factor constrained to library limits."""
    return max(4, min(31, settings.bcrypt_work_factor))


def hash_password(raw_password: str, settings: Settings) -> str:
    """Hash a raw password using bcrypt."""
    salt = bcrypt.gensalt(rounds=_bcrypt_rounds(settings))
    hashed = bcrypt.hashpw(raw_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(
    raw_password: str, hashed_password: str | None, settings: Settings
) -> bool:
    """Return True when the provided password matches the stored hash."""
    if not hashed_password:
        return False
    try:
        hashed_bytes = hashed_password.encode("utf-8")
    except AttributeError:
        return False
    return bcrypt.checkpw(raw_password.encode("utf-8"), hashed_bytes)


def create_access_token(user: User, settings: Settings) -> tuple[str, datetime]:
    """Return a signed JWT access token and its expiry timestamp."""
    now = datetime.now(UTC)
    expires = now + timedelta(minutes=settings.jwt_exp_minutes)
    payload: dict[str, Any] = {
        "sub": user.id,
        "role": user.role,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expires.timestamp()),
        "jti": secrets.token_urlsafe(8),
    }
    token = cast(
        str, jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    )
    return token, expires


def decode_access_token(token: str, settings: Settings) -> dict[str, Any]:
    """Decode and validate an access token."""
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


def generate_refresh_token(settings: Settings) -> tuple[str, datetime]:
    """Return a refresh token value and expiry timestamp."""
    value = secrets.token_urlsafe(48)
    expires = datetime.now(UTC) + timedelta(days=settings.jwt_refresh_exp_days)
    return value, expires


def hash_refresh_token(token: str) -> str:
    """Hash refresh tokens before persisting them."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def generate_session_id() -> str:
    """Return a cryptographically random session identifier."""
    return secrets.token_urlsafe(32)
