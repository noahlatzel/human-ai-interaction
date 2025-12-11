from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.api.deps import token_expiry_seconds
from app.config import Settings
from app.services import security, user_store


def test_password_hashing_roundtrip() -> None:
    """Hashes verify successfully and reject invalid inputs."""
    settings = Settings(jwt_secret="secret")
    hashed = security.hash_password("password123", settings)
    assert hashed != "password123"
    assert security.verify_password("password123", hashed, settings)
    assert not security.verify_password("wrong", hashed, settings)


def test_refresh_token_hashing_deterministic() -> None:
    """Refresh token hashes should be deterministic for identical input."""
    token = "token-value"
    first = security.hash_refresh_token(token)
    second = security.hash_refresh_token(token)
    assert first == second


def test_email_normalization() -> None:
    """Emails are normalized to lowercase without whitespace."""
    assert user_store._normalize_email("  USER@Example.COM  ") == "user@example.com"  # noqa: SLF001


def test_token_expiry_seconds_positive() -> None:
    """Token expiry helper returns positive seconds for future timestamps."""
    future = datetime.now(timezone.utc) + timedelta(minutes=5)
    seconds = token_expiry_seconds(future)
    assert 290 <= seconds <= 300
