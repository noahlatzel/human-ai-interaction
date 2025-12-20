"""FastAPI application setup."""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.router import api_router
from .config import get_settings
from .db import create_engine, create_session_factory, run_schema_migrations
from .middleware import session_middleware
from .models import ClassType
from .services import class_store, user_store
from .services.math_seed import ensure_seed_math_problems


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    """Manage application startup and shutdown tasks."""
    settings = get_settings()
    engine = create_engine(settings)
    session_factory = create_session_factory(engine)

    await run_schema_migrations(engine)
    async with session_factory() as session:
        await user_store.ensure_admin_user(session, settings)
        for grade in class_store.supported_grades():
            await class_store.ensure_system_class(
                session, grade=grade, class_type=ClassType.SOLO
            )
            await class_store.ensure_system_class(
                session, grade=grade, class_type=ClassType.GUEST
            )
        await ensure_seed_math_problems(session)
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
    app = FastAPI(
        title="Human-AI Interaction Backend",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
    app.middleware("http")(session_middleware)
    app.include_router(api_router, prefix=settings.api_prefix)

    # Mount static files for uploaded images
    uploads_dir = Path(__file__).parent.parent / "uploads"
    uploads_dir.mkdir(exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

    @app.get("/healthz")
    async def healthcheck() -> dict[str, str]:
        """Simple health endpoint for uptime checks."""
        return {"status": "ok"}

    return app


app = create_app()

__all__ = ["app", "create_app"]
