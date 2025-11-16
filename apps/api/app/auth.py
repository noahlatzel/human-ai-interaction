"""Authentication dependencies."""

from __future__ import annotations

import jwt
from fastapi import Depends, Header, HTTPException, status
from jwt import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.schema import AuthContext
from app.services import security, user_store


def _extract_bearer_token(header_value: str) -> str:
    """Extract the bearer token from the Authorization header."""
    parts = header_value.strip().split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token"
        )
    return parts[1]


async def get_current_user(
    authorization: str = Header(..., alias="Authorization"),
    settings: Settings = Depends(get_app_settings),
    session: AsyncSession = Depends(get_db_session),
) -> AuthContext:
    """Resolve the authenticated user from the Authorization header."""
    token = _extract_bearer_token(authorization)
    try:
        payload = security.decode_access_token(token, settings)
    except (InvalidTokenError, jwt.PyJWTError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc

    user_id = payload.get("sub")
    if not isinstance(user_id, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
        )

    user = await user_store.get_user_by_id(session, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    return AuthContext(user=user, claims=payload)


async def get_optional_user(
    authorization: str | None = Header(default=None, alias="Authorization"),
    settings: Settings = Depends(get_app_settings),
    session: AsyncSession = Depends(get_db_session),
) -> AuthContext | None:
    """Return the current user if credentials are present and valid."""
    if not authorization:
        return None
    try:
        return await get_current_user(
            authorization=authorization, settings=settings, session=session
        )
    except HTTPException:
        return None


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
