"""Database utilities."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from .config import Settings
from .models import Base


def create_engine(settings: Settings) -> AsyncEngine:
    """Create the async database engine used by the application."""
    return create_async_engine(
        settings.sqlite_url, echo=settings.environment == "development"
    )


def create_session_factory(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    """Return a session factory bound to the provided engine."""
    return async_sessionmaker(engine, expire_on_commit=False)


async def run_schema_migrations(engine: AsyncEngine) -> None:
    """Create database tables if they do not already exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
