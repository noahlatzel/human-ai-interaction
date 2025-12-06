from __future__ import annotations

import asyncio
from typing import cast

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.models import LearningSession
from tests.test_auth_flow import _login, unique_email


async def _fetch_learning_sessions(app: FastAPI) -> list[LearningSession]:
    """Return all learning sessions for assertions."""
    async with app.state.db_session() as db:
        result = await db.execute(select(LearningSession))
        return list(result.scalars().all())


def test_admin_create_teacher_without_tokens_or_new_session(
    client: TestClient,
) -> None:
    """Admin hitting teacher-only user creation is forbidden and session is unchanged."""
    app = cast(FastAPI, client.app)
    admin_login = _login(client, "admin@example.com", "adminpw")
    cookie_name = app.state.settings.session_cookie_name
    admin_cookie = client.cookies.get(cookie_name)
    before_sessions = asyncio.run(_fetch_learning_sessions(app))

    response = client.post(
        "/v1/users",
        headers={"Authorization": f"Bearer {admin_login['accessToken']}"},
        json={
            "email": unique_email("created-teacher"),
            "password": "teachpw",
            "role": "student",
        },
    )

    assert response.status_code == 403
    assert client.cookies.get(cookie_name) == admin_cookie
    after_sessions = asyncio.run(_fetch_learning_sessions(app))
    assert len(after_sessions) == len(before_sessions)


def test_teacher_create_student_assigns_teacher_no_new_sessions(
    client: TestClient,
) -> None:
    """Teacher-created students inherit teacherId; no new session or tokens set."""
    app = cast(FastAPI, client.app)
    teacher_email = unique_email("created-by-admin")

    register_teacher = client.post(
        "/v1/auth/register",
        json={"email": teacher_email, "password": "teachpw", "role": "teacher"},
    )
    assert register_teacher.status_code == 201
    teacher_id = register_teacher.json()["user"]["id"]

    teacher_login = _login(client, teacher_email, "teachpw")
    cookie_name = app.state.settings.session_cookie_name
    teacher_cookie = client.cookies.get(cookie_name)
    before_sessions = asyncio.run(_fetch_learning_sessions(app))

    response = client.post(
        "/v1/users",
        headers={"Authorization": f"Bearer {teacher_login['accessToken']}"},
        json={
            "email": unique_email("created-student"),
            "password": "studpw",
            "role": "student",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert set(body.keys()) == {"user"}
    assert body["user"]["role"] == "student"
    assert body["user"]["teacherId"] == teacher_id
    assert client.cookies.get(cookie_name) == teacher_cookie

    after_sessions = asyncio.run(_fetch_learning_sessions(app))
    assert len(after_sessions) == len(before_sessions)
