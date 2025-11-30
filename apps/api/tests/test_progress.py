from __future__ import annotations

from typing import Any
from uuid import uuid4

from fastapi.testclient import TestClient


def unique_email(label: str) -> str:
    """Return a unique email address for tests."""
    return f"{label}-{uuid4().hex}@example.com"


def login(client: TestClient, email: str, password: str) -> dict[str, Any]:
    """Authenticate a user and return the token payload."""
    response = client.post(
        "/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()


def create_problem(
    client: TestClient,
    token: str,
    *,
    description: str = "Sample problem",
    solution: str = "42",
    difficulty: str = "mittel",
) -> dict[str, Any]:
    """Create a math word problem using an authorized token."""
    response = client.post(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "problemDescription": description,
            "solution": solution,
            "difficulty": difficulty,
            "operations": ["addition"],
        },
    )
    assert response.status_code == 201
    return response.json()


def test_student_can_set_and_update_progress(client: TestClient) -> None:
    """Students can create and update their own progress records."""
    admin_tokens = login(client, "admin@example.com", "adminpw")
    problem = create_problem(client, admin_tokens["accessToken"])

    student_email = unique_email("student")
    register_resp = client.post(
        "/v1/auth/register",
        json={"email": student_email, "password": "studpw", "role": "student"},
    )
    assert register_resp.status_code == 201
    student_tokens = register_resp.json()

    set_resp = client.post(
        "/v1/progress",
        headers={"Authorization": f"Bearer {student_tokens['accessToken']}"},
        json={"mathWordProblemId": problem["id"], "success": True},
    )
    assert set_resp.status_code == 200
    payload = set_resp.json()
    assert payload["success"] is True

    update_resp = client.post(
        "/v1/progress",
        headers={"Authorization": f"Bearer {student_tokens['accessToken']}"},
        json={"mathWordProblemId": problem["id"], "success": False},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["success"] is False
    assert update_resp.json()["id"] == payload["id"]


def test_progress_requires_success_and_valid_problem(client: TestClient) -> None:
    """Missing success or invalid problem ids are rejected."""
    admin_tokens = login(client, "admin@example.com", "adminpw")
    problem = create_problem(client, admin_tokens["accessToken"])

    student_email = unique_email("student")
    student_resp = client.post(
        "/v1/auth/register",
        json={"email": student_email, "password": "studpw", "role": "student"},
    )
    assert student_resp.status_code == 201
    student_token = student_resp.json()["accessToken"]

    missing_success = client.post(
        "/v1/progress",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"mathWordProblemId": problem["id"]},
    )
    assert missing_success.status_code == 422

    invalid_problem = client.post(
        "/v1/progress",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"mathWordProblemId": "does-not-exist", "success": True},
    )
    assert invalid_problem.status_code == 404


def test_guest_student_can_set_progress(client: TestClient) -> None:
    """Guest students can set progress using their access token."""
    admin_tokens = login(client, "admin@example.com", "adminpw")
    problem = create_problem(client, admin_tokens["accessToken"])

    guest_resp = client.post("/v1/auth/guest", json={"firstName": "Guesty"})
    assert guest_resp.status_code == 201
    guest_token = guest_resp.json()["accessToken"]

    progress_resp = client.post(
        "/v1/progress",
        headers={"Authorization": f"Bearer {guest_token}"},
        json={"mathWordProblemId": problem["id"], "success": True},
    )
    assert progress_resp.status_code == 200
    assert progress_resp.json()["success"] is True


def test_teacher_progress_summary_scopes_students(client: TestClient) -> None:
    """Teachers see progress only for their students with correct aggregates."""
    admin_tokens = login(client, "admin@example.com", "adminpw")

    teacher_email = unique_email("teacher")
    teacher_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={"email": teacher_email, "password": "teachpw", "role": "teacher"},
    )
    assert teacher_resp.status_code == 201
    teacher_tokens = teacher_resp.json()

    problem_one = create_problem(
        client, teacher_tokens["accessToken"], description="P1"
    )
    problem_two = create_problem(
        client, teacher_tokens["accessToken"], description="P2"
    )

    student_one_email = unique_email("stud1")
    client.cookies.clear()
    student_one_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        json={"email": student_one_email, "password": "studpw", "role": "student"},
    )
    assert student_one_resp.status_code == 201
    student_one_token = student_one_resp.json()["accessToken"]

    student_two_email = unique_email("stud2")
    client.cookies.clear()
    student_two_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        json={"email": student_two_email, "password": "studpw", "role": "student"},
    )
    assert student_two_resp.status_code == 201

    # Use bearer tokens only for progress mutations to avoid cross-user cookies.
    client.cookies.clear()

    # Student one solves one of two problems.
    client.post(
        "/v1/progress",
        headers={"Authorization": f"Bearer {student_one_token}"},
        json={"mathWordProblemId": problem_one["id"], "success": True},
    )
    client.post(
        "/v1/progress",
        headers={"Authorization": f"Bearer {student_one_token}"},
        json={"mathWordProblemId": problem_two["id"], "success": False},
    )

    # Ensure teacher bearer token is used instead of any student session cookie.
    client.cookies.clear()
    summary_resp = client.get(
        "/v1/progress/students",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
    )
    assert summary_resp.status_code == 200
    summary = summary_resp.json()

    assert summary["totalProblems"] == 2
    assert len(summary["students"]) == 2

    student_rows = {item["studentId"]: item for item in summary["students"]}
    solved_one = student_rows[student_one_resp.json()["user"]["id"]]
    solved_two = student_rows[student_two_resp.json()["user"]["id"]]

    assert solved_one["solved"] == 1
    assert solved_one["completionRate"] == 0.5
    assert solved_two["solved"] == 0
    assert solved_two["completionRate"] == 0.0


def test_progress_summary_handles_zero_problems(client: TestClient) -> None:
    """Summary should return zero totals when no problems exist."""
    admin_tokens = login(client, "admin@example.com", "adminpw")

    teacher_email = unique_email("teacher-zero")
    teacher_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={"email": teacher_email, "password": "teachpw", "role": "teacher"},
    )
    assert teacher_resp.status_code == 201
    teacher_token = teacher_resp.json()["accessToken"]

    student_email = unique_email("student-zero")
    student_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={"email": student_email, "password": "studpw", "role": "student"},
    )
    assert student_resp.status_code == 201

    client.cookies.clear()
    summary_resp = client.get(
        "/v1/progress/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
    )
    assert summary_resp.status_code == 200
    summary = summary_resp.json()

    assert summary["totalProblems"] == 0
    assert len(summary["students"]) == 1
    student_summary = summary["students"][0]
    assert student_summary["solved"] == 0
    assert student_summary["completionRate"] == 0.0
