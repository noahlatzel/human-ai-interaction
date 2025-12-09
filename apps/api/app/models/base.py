"""Shared SQLAlchemy base utilities."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.orm import DeclarativeBase


def utcnow() -> datetime:
    """Return a timezone-aware UTC timestamp."""
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    """Declarative base class for ORM models."""


def format_timestamp(value: datetime) -> str:
    """Serialize timestamps in ISO-8601 Zulu format."""
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


__all__ = ["Base", "utcnow", "format_timestamp"]
