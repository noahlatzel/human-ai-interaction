"""Dependency helpers used by API routes."""

from __future__ import annotations

from collections.abc import AsyncIterator
from typing import cast

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from .config import Settings, get_settings


async def get_db_session(request: Request) -> AsyncIterator[AsyncSession]:
    """Yield a request-scoped database session."""
    session_factory = cast(
        async_sessionmaker[AsyncSession], request.app.state.db_session
    )
    async with session_factory() as session:
        yield session


def get_app_settings(request: Request) -> Settings:
    """Return the Settings instance stored on the FastAPI app."""
    settings = getattr(request.app.state, "settings", None)
    if settings is not None:
        return cast(Settings, settings)
    return get_settings()
