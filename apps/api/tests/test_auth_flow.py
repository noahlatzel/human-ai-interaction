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
    """Registering a teacher without admin token now succeeds (open registration)."""
    response = client.post(
        "/v1/auth/register",
        json={
            "email": "teacher@example.com",
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert response.status_code == 201


def _create_class(
    client: TestClient, token: str, grade: int = 3, suffix: str = ""
) -> dict[str, Any]:
    """Helper to create a class for a teacher."""
    response = client.post(
        "/v1/classes",
        headers={"Authorization": f"Bearer {token}"},
        json={"grade": grade, "suffix": suffix},
    )
    assert response.status_code == 201
    return response.json()


def test_register_student_as_teacher(client: TestClient) -> None:
    """Teacher registering a student assigns them to a class they own."""
    teacher_email = unique_email("teacher")
    register_resp = client.post(
        "/v1/auth/register",
        json={
            "email": teacher_email,
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert register_resp.status_code == 201
    teacher_tokens = _login(client, teacher_email, "teachpw")
    created_class = _create_class(
        client, teacher_tokens["accessToken"], grade=3, suffix="a"
    )

    student_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        json={
            "email": unique_email("student"),
            "password": "studpw",
            "role": "student",
            "classId": created_class["id"],
        },
    )
    assert student_resp.status_code == 201
    student_body = student_resp.json()
    assert student_body["user"]["role"] == "student"
    assert student_body["user"]["classId"] == created_class["id"]
    assert student_body["user"]["classGrade"] == 3


def test_register_solo_student_requires_grade(client: TestClient) -> None:
    """Students without a class must provide grade and are placed into a system class."""
    missing_grade = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("solo-student-missing"),
            "password": "studpw",
            "role": "student",
        },
    )
    assert missing_grade.status_code == 400

    response = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("solo-student"),
            "password": "studpw",
            "role": "student",
            "grade": 4,
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["user"]["classId"]
    assert body["user"]["classGrade"] == 4
    assert body["user"]["classLabel"] == "4"


def test_register_student_invalid_class_id(client: TestClient) -> None:
    """Supplying a non-existent class id fails."""
    response = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("invalid-class"),
            "password": "studpw",
            "role": "student",
            "classId": "missing-class-id",
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
    client.cookies.clear()
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


def test_admin_cannot_register_students(client: TestClient) -> None:
    """Admins are forbidden from registering students directly."""
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    response = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "email": unique_email("admin-student"),
            "password": "studpw",
            "role": "student",
            "grade": 3,
        },
    )
    assert response.status_code == 403


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
