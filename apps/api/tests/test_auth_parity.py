from __future__ import annotations

import asyncio
from typing import cast

import jwt
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.models import UserSession
from tests.test_auth_flow import _login, unique_email


async def _fetch_session(app: FastAPI, session_id: str) -> UserSession | None:
    """Return a user session by id."""
    async with app.state.db_session() as db:
        return await db.get(UserSession, session_id)


def test_cookie_and_bearer_mismatch_returns_401(client: TestClient) -> None:
    """A stale cookie paired with another user's bearer token is rejected."""
    app = cast(FastAPI, client.app)
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    cookie_name = app.state.settings.session_cookie_name
    admin_cookie = client.cookies.get(cookie_name)
    assert admin_cookie

    teacher_email = unique_email("teacher-mismatch")
    register_teacher = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": teacher_email,
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert register_teacher.status_code == 201
    teacher_token = register_teacher.json()["accessToken"]

    # Restore the admin cookie so cookie and bearer disagree.
    client.cookies.set(cookie_name, admin_cookie)
    response = client.post(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "problemDescription": "Mismatch test",
            "solution": "42",
            "difficulty": "einfach",
            "operations": ["addition"],
        },
    )
    assert response.status_code == 401


def test_bearer_only_updates_session_activity(client: TestClient) -> None:
    """Bearer-only calls still roll session activity via sid claim validation."""
    app = cast(FastAPI, client.app)
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    session_id = admin_tokens["sessionId"]

    before = asyncio.run(_fetch_session(app, session_id))
    assert before is not None
    before_last_seen = before.last_seen_at

    client.cookies.clear()
    register_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": unique_email("bearer-only"),
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert register_resp.status_code == 201

    after = asyncio.run(_fetch_session(app, session_id))
    assert after is not None
    assert after.last_seen_at >= before_last_seen
    assert (
        after.last_seen_at != before_last_seen or after.expires_at != before.expires_at
    )


def test_tokens_carry_session_and_guest_claims(client: TestClient) -> None:
    """Access tokens embed session ids, learning session ids, and guest flags."""
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    admin_claims = jwt.decode(
        admin_tokens["accessToken"],
        "test-secret",
        algorithms=["HS256"],
        options={"verify_exp": False},
    )

    assert admin_claims["sid"] == admin_tokens["sessionId"]
    assert admin_claims["lsid"] == admin_tokens["learningSessionId"]
    assert admin_claims["guest"] is False

    guest_resp = client.post("/v1/auth/guest", json={"firstName": "Guesty"})
    assert guest_resp.status_code == 201
    guest_tokens = guest_resp.json()
    guest_claims = jwt.decode(
        guest_tokens["accessToken"],
        "test-secret",
        algorithms=["HS256"],
        options={"verify_exp": False},
    )

    assert guest_claims["guest"] is True
    assert guest_claims["sid"] == guest_tokens["sessionId"]
    assert guest_claims["lsid"] == guest_tokens["learningSessionId"]
    assert guest_tokens["refreshToken"] is None
