"""Middleware to handle session cookie validation and rolling refresh."""

from __future__ import annotations

from fastapi import Request
from fastapi.responses import Response as FastAPIResponse

from app.api.deps import clear_session_cookie, set_session_cookie
from app.auth import AuthContext
from app.services import sessions


async def session_middleware(request: Request, call_next) -> FastAPIResponse:
    """Validate session cookies, refresh expiry, and attach context to request.state."""
    settings = request.app.state.settings
    session_id = request.cookies.get(settings.session_cookie_name)
    refreshed_session = None
    clear_cookie = False
    mutated = False

    session_context: AuthContext | None = None
    request.state.skip_session_cookie_refresh = False
    if session_id:
        session_factory = request.app.state.db_session
        async with session_factory() as db_session:
            validation = await sessions.validate_session(
                db_session, session_id, settings
            )
            mutated = validation.mutated
            if validation.user_session and validation.user:
                session_context = AuthContext(
                    user=validation.user,
                    claims={"session": validation.user_session.id},
                    session_id=validation.user_session.id,
                    learning_session_id=validation.user_session.learning_session_id,
                )
                refreshed_session = validation.user_session
            else:
                clear_cookie = True
            if mutated:
                await db_session.commit()

    request.state.session_context = session_context
    response = await call_next(request)

    skip_refresh = getattr(request.state, "skip_session_cookie_refresh", False)
    if refreshed_session and not skip_refresh:
        set_session_cookie(response, refreshed_session, settings)
    if clear_cookie:
        clear_session_cookie(response, settings)
    return response


__all__ = ["session_middleware"]
