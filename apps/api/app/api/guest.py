"""Guest login routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.services import learning, sessions, user_store

from .deps import issue_tokens, set_session_cookie
from .schemas.auth import AuthSuccess, GuestLoginRequest

router = APIRouter()


@router.post("/guest", response_model=AuthSuccess, status_code=status.HTTP_201_CREATED)
async def create_guest(
    payload: GuestLoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
) -> AuthSuccess:
    """Create a guest student, start a learning session, and set a session cookie."""
    user = await user_store.create_guest_user(session, first_name=payload.firstName)
    learning_session = await learning.start_learning_session(session, user)
    user_session = await sessions.create_user_session(
        session, settings, user, learning_session
    )
    tokens = await issue_tokens(session, user, settings, include_refresh=False)
    set_session_cookie(response, user_session, settings)
    await session.commit()
    return tokens.model_copy(
        update={
            "sessionId": user_session.id,
            "learningSessionId": learning_session.id,
        }
    )


__all__ = ["router"]
