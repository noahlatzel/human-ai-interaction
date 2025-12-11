"""Application configuration helpers."""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="HAII_",
        extra="ignore",
    )

    api_prefix: str = "/v1"
    allowed_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
            "http://localhost:5175",
            "http://127.0.0.1:5175",
            "http://localhost:5176",
            "http://127.0.0.1:5176",
        ],
        description="CORS origins allowed to talk to the API.",
    )

    sqlite_url: str = Field(
        default="sqlite+aiosqlite:///./auth.db",
        description="SQLAlchemy compatible SQLite connection string.",
    )
    api_host: str = Field(
        default="0.0.0.0",
        description="Host interface uvicorn should bind to.",
    )
    api_port: int = Field(
        default=8000,
        description="Port uvicorn should listen on.",
    )
    root_path: str = Field(
        default="",
        description="ASGI root_path for deployments behind a subpath (e.g. /haii/api).",
    )
    reload: bool = Field(
        default=False,
        description="Enable auto-reload (development only).",
    )

    environment: str = Field(
        default="development",
        description="Deployment environment identifier used for logging decisions.",
    )

    jwt_secret: str = Field(
        default="change-me",
        description="Secret used to sign JWT access tokens. MUST be overridden outside dev.",
    )
    jwt_algorithm: str = "HS256"
    jwt_exp_minutes: int = 60
    jwt_refresh_exp_days: int = 30

    bcrypt_work_factor: int = 12

    admin_email: str = Field(default="admin@example.com")
    admin_password: str = Field(default="adminpw")

    session_cookie_name: str = Field(
        default="haii_session",
        description="Name of the cookie carrying the opaque session id.",
    )
    session_cookie_secure: bool = Field(
        default=False,
        description="Whether to set the session cookie as Secure (enable in prod).",
    )
    session_ttl_hours: float = Field(
        default=3.0, description="Rolling session TTL (hours) refreshed on activity."
    )
    session_absolute_ttl_hours: float = Field(
        default=24.0, description="Absolute maximum session lifetime (hours)."
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value: object) -> list[str]:
        """Ensure origins are normalized when provided as comma-separated values."""
        if isinstance(value, str):
            items = [chunk.strip() for chunk in value.split(",") if chunk.strip()]
            return items or ["*"]
        if isinstance(value, list):
            return value
        return ["*"]


@lru_cache(maxsize=1)
def _cached_settings() -> Settings:
    """Return a cached Settings instance to avoid reparsing env vars."""
    return Settings()


def get_settings() -> Settings:
    """Return the process-wide Settings instance."""
    return _cached_settings()


def reset_settings_cache() -> None:
    """Clear the cached settings (useful for tests)."""
    _cached_settings.cache_clear()
