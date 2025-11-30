from __future__ import annotations

from typing import Any
from uuid import uuid4

from fastapi.testclient import TestClient


def login(client: TestClient, email: str, password: str) -> dict[str, Any]:
    """Authenticate a user and return the token payload."""
    response = client.post(
        "/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()


def create_teacher(client: TestClient, admin_token: str) -> tuple[str, str]:
    """Create a teacher using an admin token and return (email, id)."""
    email = unique_email("teacher")
    response = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"email": email, "password": "teachpw", "role": "teacher"},
    )
    assert response.status_code == 201
    body = response.json()
    return email, body["user"]["id"]


def create_problem(
    client: TestClient,
    token: str,
    *,
    problem_description: str = "Sample problem",
    solution: str = "42",
    difficulty: str = "mittel",
    operations: list[str] | None = None,
) -> dict[str, Any]:
    """Helper to create a math word problem."""
    response = client.post(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "problemDescription": problem_description,
            "solution": solution,
            "difficulty": difficulty,
            "operations": operations or ["addition"],
        },
    )
    assert response.status_code == 201
    return response.json()


def test_create_requires_teacher_or_admin(client: TestClient) -> None:
    """Students cannot create math word problems."""
    student_email = unique_email("student")
    register_resp = client.post(
        "/v1/auth/register",
        json={"email": student_email, "password": "studpw", "role": "student"},
    )
    assert register_resp.status_code == 201
    student_tokens = login(client, student_email, "studpw")

    create_resp = client.post(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {student_tokens['accessToken']}"},
        json={
            "problemDescription": "Add two numbers.",
            "solution": "2",
            "difficulty": "einfach",
            "operations": ["addition"],
        },
    )
    assert create_resp.status_code == 403


def test_teacher_create_filter_and_sort(client: TestClient) -> None:
    """Teachers can create problems; filtering and sorting behave as expected."""
    admin_tokens = login(client, "admin@example.com", "adminpw")
    teacher_email, _ = create_teacher(client, admin_tokens["accessToken"])
    teacher_tokens = login(client, teacher_email, "teachpw")

    first = create_problem(
        client,
        teacher_tokens["accessToken"],
        problem_description="Add and subtract.",
        solution="0",
        difficulty="mittel",
        operations=["addition", "subtraction"],
    )
    second = create_problem(
        client,
        teacher_tokens["accessToken"],
        problem_description="Add and multiply.",
        solution="0",
        difficulty="schwierig",
        operations=["addition", "multiplication"],
    )
    third = create_problem(
        client,
        teacher_tokens["accessToken"],
        problem_description="Subtract then add.",
        solution="0",
        difficulty="einfach",
        operations=["subtraction", "addition"],
    )

    filter_resp = client.get(
        "/v1/math-problems",
        params=[("operations", "addition"), ("operations", "subtraction")],
    )
    assert filter_resp.status_code == 200
    filtered_ids = {item["id"] for item in filter_resp.json()["problems"]}
    assert filtered_ids == {first["id"], third["id"]}
    assert second["id"] not in filtered_ids

    sort_resp = client.get("/v1/math-problems", params={"difficultyOrder": "desc"})
    assert sort_resp.status_code == 200
    difficulties = [item["difficulty"] for item in sort_resp.json()["problems"]]
    assert difficulties == ["schwierig", "mittel", "einfach"]


def test_admin_can_delete_problem(client: TestClient) -> None:
    """Admins can delete problems and they disappear from listings."""
    admin_tokens = login(client, "admin@example.com", "adminpw")
    created = create_problem(
        client,
        admin_tokens["accessToken"],
        problem_description="Delete me",
        solution="N/A",
        difficulty="mittel",
        operations=["division"],
    )

    delete_resp = client.delete(
        f"/v1/math-problems/{created['id']}",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
    )
    assert delete_resp.status_code == 204

    list_resp = client.get("/v1/math-problems")
    assert list_resp.status_code == 200
    ids = {item["id"] for item in list_resp.json()["problems"]}
    assert created["id"] not in ids


def test_invalid_difficulty_rejected(client: TestClient) -> None:
    """Difficulty outside permitted range is rejected."""
    admin_tokens = login(client, "admin@example.com", "adminpw")
    response = client.post(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "problemDescription": "Too hard?",
            "solution": "N/A",
            "difficulty": "unmoeglich",
            "operations": ["addition"],
        },
    )
    assert response.status_code == 422


def unique_email(label: str) -> str:
    """Return a unique email address for tests."""
    return f"{label}-{uuid4().hex}@example.com"
