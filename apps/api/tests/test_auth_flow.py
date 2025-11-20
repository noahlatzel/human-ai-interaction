from __future__ import annotations

from typing import Any
from uuid import uuid4

from fastapi.testclient import TestClient


def _login(client: TestClient, email: str, password: str) -> dict[str, Any]:
    """Helper for authenticating inside tests."""
    response = client.post(
        "/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()


def test_admin_login_success(client: TestClient) -> None:
    """Admin seeded at startup can login successfully."""
    response = client.post(
        "/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpw"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["user"]["role"] == "admin"
    assert body["accessToken"]
    assert body["refreshToken"]


def test_login_invalid_credentials(client: TestClient) -> None:
    """Invalid credentials return 401."""
    response = client.post(
        "/v1/auth/login",
        json={"email": "admin@example.com", "password": "wrong"},
    )
    assert response.status_code == 401


def test_register_teacher_requires_admin(client: TestClient) -> None:
    """Registering a teacher without admin token fails."""
    response = client.post(
        "/v1/auth/register",
        json={
            "email": "teacher@example.com",
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert response.status_code == 403


def test_register_student_as_teacher(client: TestClient) -> None:
    """Teacher registering a student assigns themselves as teacher."""
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    teacher_email = unique_email("teacher")
    register_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": teacher_email,
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert register_resp.status_code == 201
    teacher_tokens = _login(client, teacher_email, "teachpw")

    student_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        json={
            "email": unique_email("student"),
            "password": "studpw",
            "role": "student",
        },
    )
    assert student_resp.status_code == 201
    student_body = student_resp.json()
    assert student_body["user"]["role"] == "student"
    assert student_body["user"]["teacherId"] == teacher_tokens["user"]["id"]


def test_register_solo_student(client: TestClient) -> None:
    """Students without a teacher get the solo-student placeholder."""
    response = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("solo-student"),
            "password": "studpw",
            "role": "student",
        },
    )
    assert response.status_code == 201
    assert response.json()["user"]["teacherId"] == "solo-student"


def test_register_student_with_specific_teacher(client: TestClient) -> None:
    """Admin can assign a student to a specific teacher id."""
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    teacher_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": unique_email("assign-teacher"),
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert teacher_resp.status_code == 201
    teacher_id = teacher_resp.json()["user"]["id"]

    student_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": unique_email("student-assigned"),
            "password": "studpw",
            "role": "student",
            "teacherId": teacher_id,
        },
    )
    assert student_resp.status_code == 201
    assert student_resp.json()["user"]["teacherId"] == teacher_id


def test_register_student_invalid_teacher_id(client: TestClient) -> None:
    """Supplying a non-existent teacher id fails."""
    response = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("invalid-teacher"),
            "password": "studpw",
            "role": "student",
            "teacherId": "missing-teacher-id",
        },
    )
    assert response.status_code == 404


def test_register_conflict_returns_409(client: TestClient) -> None:
    """Reusing an email address is rejected."""
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    conflict_email = unique_email("teacher-conflict")
    first = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": conflict_email,
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert first.status_code == 201
    duplicate = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": conflict_email,
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert duplicate.status_code == 409


def test_refresh_and_logout_flow(client: TestClient) -> None:
    """Refresh tokens rotate and logout invalidates refresh token."""
    tokens = _login(client, "admin@example.com", "adminpw")

    refresh_resp = client.post(
        "/v1/auth/refresh",
        json={"refreshToken": tokens["refreshToken"]},
    )
    assert refresh_resp.status_code == 200
    refreshed = refresh_resp.json()
    assert refreshed["refreshToken"] != tokens["refreshToken"]

    # Old refresh token no longer valid
    retry_resp = client.post(
        "/v1/auth/refresh",
        json={"refreshToken": tokens["refreshToken"]},
    )
    assert retry_resp.status_code == 401

    logout_resp = client.post(
        "/v1/auth/logout",
        json={"refreshToken": refreshed["refreshToken"]},
    )
    assert logout_resp.status_code == 204

    post_logout = client.post(
        "/v1/auth/refresh",
        json={"refreshToken": refreshed["refreshToken"]},
    )
    assert post_logout.status_code == 401


def unique_email(label: str) -> str:
    """Return a unique email address for tests."""
    return f"{label}-{uuid4().hex}@example.com"
