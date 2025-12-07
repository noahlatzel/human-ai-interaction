from __future__ import annotations

import asyncio
from typing import cast

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.models import LearningSession, UserSession
from tests.test_auth_flow import _login, unique_email


async def _fetch_learning_sessions(app: FastAPI) -> list[LearningSession]:
    """Return all learning sessions for assertions."""
    async with app.state.db_session() as db:
        result = await db.execute(select(LearningSession))
        return list(result.scalars().all())


async def _fetch_session(app: FastAPI, session_id: str) -> UserSession | None:
    """Return a user session by id."""
    async with app.state.db_session() as db:
        return await db.get(UserSession, session_id)


def test_guest_login_sets_cookie_and_learning_session(client: TestClient) -> None:
    """Guests can enter with first name only and receive a session cookie."""
    app = cast(FastAPI, client.app)
    response = client.post("/v1/auth/guest", json={"firstName": "Guesty", "grade": 3})
    assert response.status_code == 201
    body = response.json()
    cookie_name = app.state.settings.session_cookie_name
    assert response.cookies.get(cookie_name)
    assert body["user"]["isGuest"] is True
    assert body["user"]["email"] is None
    assert body["user"]["classGrade"] == 3
    assert body["user"]["classId"]

    learning_sessions = asyncio.run(_fetch_learning_sessions(app))
    assert len(learning_sessions) == 1
    assert learning_sessions[0].ended_at is None


def test_session_cookie_allows_authenticated_register(client: TestClient) -> None:
    """Existing session cookie can authorize protected actions."""
    app = cast(FastAPI, client.app)
    _login(client, "admin@example.com", "adminpw")
    cookie_name = app.state.settings.session_cookie_name
    assert client.cookies.get(cookie_name)

    register_resp = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("cookie-teacher"),
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert register_resp.status_code == 201
    assert register_resp.json()["user"]["role"] == "teacher"


def test_logout_clears_session_cookie_and_ends_learning_session(
    client: TestClient,
) -> None:
    """Logout revokes session cookie and timestamps the learning session end."""
    app = cast(FastAPI, client.app)
    login_body = _login(client, "admin@example.com", "adminpw")
    cookie_name = app.state.settings.session_cookie_name
    session_id = client.cookies.get(cookie_name)
    assert session_id

    response = client.post(
        "/v1/auth/logout", json={"refreshToken": login_body["refreshToken"]}
    )
    assert response.status_code == 204
    assert client.cookies.get(cookie_name) is None

    learning_sessions = asyncio.run(_fetch_learning_sessions(app))
    assert len(learning_sessions) == 1
    assert learning_sessions[0].ended_at is not None

    session_record = asyncio.run(_fetch_session(app, session_id))
    assert session_record is not None
    assert session_record.revoked_at is not None
