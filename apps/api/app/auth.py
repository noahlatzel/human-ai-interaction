"""Authentication dependencies."""

from __future__ import annotations

import jwt
from fastapi import Depends, Header, HTTPException, Request, status
from jwt import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.schema import AuthContext
from app.services import security, sessions


def _extract_bearer_token(header_value: str) -> str:
    """Extract the bearer token from the Authorization header."""
    parts = header_value.strip().split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token"
        )
    return parts[1]


def _unauthorized(detail: str) -> HTTPException:
    """Return a 401 HTTPException with the provided detail."""
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


async def _resolve_bearer_context(
    authorization: str,
    settings: Settings,
    session: AsyncSession,
) -> AuthContext:
    """Resolve authentication using the Authorization bearer token."""
    token = _extract_bearer_token(authorization)
    try:
        payload = security.decode_access_token(token, settings)
    except (InvalidTokenError, jwt.PyJWTError) as exc:
        raise _unauthorized("Invalid token") from exc

    user_id = payload.get("sub")
    session_id = payload.get("sid")
    learning_session_id = payload.get("lsid")

    if not isinstance(user_id, str) or not isinstance(session_id, str):
        raise _unauthorized("Invalid token payload")

    validation = await sessions.validate_session(session, session_id, settings)
    if not validation.user_session or not validation.user:
        raise _unauthorized("Invalid or expired session")
    if validation.user.id != user_id:
        raise _unauthorized("Invalid token payload")

    guest_claim = payload.get("guest")
    if isinstance(guest_claim, bool) and guest_claim != bool(validation.user.is_guest):
        raise _unauthorized("Invalid token payload")

    if validation.mutated:
        await session.flush()

    active_learning_session_id = validation.user_session.learning_session_id
    if active_learning_session_id is None and isinstance(learning_session_id, str):
        active_learning_session_id = learning_session_id

    return AuthContext(
        user=validation.user,
        claims=payload,
        session_id=session_id,
        learning_session_id=active_learning_session_id,
    )


async def _resolve_session_context(
    request: Request,
) -> AuthContext | None:
    """Resolve authentication using context prepared by middleware, if present."""
    return getattr(request.state, "session_context", None)


def _select_context(
    bearer_context: AuthContext | None,
    session_context: AuthContext | None,
    *,
    required: bool,
) -> AuthContext | None:
    """Choose between bearer and session contexts, enforcing mismatch rules."""
    if bearer_context and session_context and bearer_context.uid != session_context.uid:
        raise _unauthorized("Credential mismatch")
    if bearer_context:
        return bearer_context
    if session_context:
        return session_context
    if required:
        raise _unauthorized("Missing credentials")
    return None


async def get_current_user(
    request: Request,
    authorization: str | None = Header(default=None, alias="Authorization"),
    settings: Settings = Depends(get_app_settings),
    session: AsyncSession = Depends(get_db_session),
) -> AuthContext:
    """Resolve the authenticated user from either bearer token or session cookie."""
    bearer_context: AuthContext | None = None
    if authorization:
        bearer_context = await _resolve_bearer_context(authorization, settings, session)

    session_context = await _resolve_session_context(request)
    selected = _select_context(bearer_context, session_context, required=True)
    assert selected is not None  # for type checkers
    return selected


async def get_optional_user(
    request: Request,
    authorization: str | None = Header(default=None, alias="Authorization"),
    settings: Settings = Depends(get_app_settings),
    session: AsyncSession = Depends(get_db_session),
) -> AuthContext | None:
    """Return the current user if credentials are present and valid."""
    bearer_context: AuthContext | None = None
    if authorization:
        try:
            bearer_context = await _resolve_bearer_context(
                authorization, settings, session
            )
        except HTTPException:
            return None

    session_context = await _resolve_session_context(request)
    return _select_context(bearer_context, session_context, required=False)


def require_roles(*roles: str):
    """Return a dependency that ensures the caller has one of the specified roles."""
    role_set = set(roles)

    async def dependency(
        context: AuthContext = Depends(get_current_user),
    ) -> AuthContext:
        if context.role not in role_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden"
            )
        return context

    return dependency


__all__ = ["AuthContext", "get_current_user", "get_optional_user", "require_roles"]
