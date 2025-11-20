"""FastAPI application setup."""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router
from .config import get_settings
from .db import create_engine, create_session_factory, run_schema_migrations
from .middleware import session_middleware
from .services import user_store


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    """Manage application startup and shutdown tasks."""
    settings = get_settings()
    engine = create_engine(settings)
    session_factory = create_session_factory(engine)

    await run_schema_migrations(engine)
    async with session_factory() as session:
        await user_store.ensure_admin_user(session, settings)
        await session.commit()

    application.state.settings = settings
    application.state.db_session = session_factory
    try:
        yield
    finally:
        await engine.dispose()


def create_app() -> FastAPI:
    """Instantiate the FastAPI app."""
    settings = get_settings()
    app = FastAPI(title="Human-AI Interaction Backend", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
    app.middleware("http")(session_middleware)
    app.include_router(api_router, prefix=settings.api_prefix)

    @app.get("/healthz")
    async def healthcheck() -> dict[str, str]:
        """Simple health endpoint for uptime checks."""
        return {"status": "ok"}

    return app


app = create_app()

__all__ = ["app", "create_app"]
