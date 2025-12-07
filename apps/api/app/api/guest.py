"""Guest login routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.dependencies import get_app_settings, get_db_session
from app.models import ClassType
from app.services import class_store, learning, sessions, user_store

from .deps import issue_tokens, set_session_cookie
from .schemas.auth import AuthSuccess, GuestLoginRequest

router = APIRouter()


@router.post("/guest", response_model=AuthSuccess, status_code=status.HTTP_201_CREATED)
async def create_guest(
    payload: GuestLoginRequest,
    response: Response,
    request: Request,
    session: AsyncSession = Depends(get_db_session),
    settings: Settings = Depends(get_app_settings),
) -> AuthSuccess:
    """Create a guest student, start a learning session, and set a session cookie."""
    try:
        guest_class = await class_store.ensure_system_class(
            session, grade=payload.grade, class_type=ClassType.GUEST
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    user = await user_store.create_guest_user(
        session, first_name=payload.firstName, class_id=guest_class.id
    )
    learning_session = await learning.start_learning_session(session, user)
    user_session = await sessions.create_user_session(
        session, settings, user, learning_session
    )
    tokens = await issue_tokens(
        session,
        user,
        settings,
        include_refresh=False,
        session_id=user_session.id,
        learning_session_id=learning_session.id,
        is_guest=user.is_guest,
    )
    set_session_cookie(response, user_session, settings)
    request.state.skip_session_cookie_refresh = True
    await session.commit()
    return tokens.model_copy(
        update={
            "sessionId": user_session.id,
            "learningSessionId": learning_session.id,
        }
    )


__all__ = ["router"]
