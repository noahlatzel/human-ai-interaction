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
    grade: int = 3,
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
            "grade": grade,
            "operations": operations or ["addition"],
        },
    )
    assert response.status_code == 201
    return response.json()


def test_create_requires_teacher_or_admin(client: TestClient) -> None:
    """Only teachers can create math word problems; students and admins are forbidden."""
    student_email = unique_email("student")
    register_resp = client.post(
        "/v1/auth/register",
        json={
            "email": student_email,
            "password": "studpw",
            "role": "student",
            "grade": 3,
        },
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
            "grade": 3,
            "operations": ["addition"],
        },
    )
    assert create_resp.status_code == 403

    admin_tokens = login(client, "admin@example.com", "adminpw")
    client.cookies.clear()

    admin_resp = client.post(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={
            "problemDescription": "Admin not allowed.",
            "solution": "0",
            "difficulty": "einfach",
            "grade": 3,
            "operations": ["addition"],
        },
    )
    assert admin_resp.status_code == 403


def test_teacher_create_filter_and_sort(client: TestClient) -> None:
    """Teachers can create problems; filtering and sorting behave as expected."""
    teacher_email, _ = create_teacher(
        client, login(client, "admin@example.com", "adminpw")["accessToken"]
    )
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


def test_student_lists_only_matching_grade(client: TestClient) -> None:
    """Students see only problems matching their class grade; teachers can filter by grade."""
    teacher_email, _ = create_teacher(
        client, login(client, "admin@example.com", "adminpw")["accessToken"]
    )
    teacher_tokens = login(client, teacher_email, "teachpw")

    class_resp = client.post(
        "/v1/classes",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        json={"grade": 3, "suffix": "a"},
    )
    assert class_resp.status_code == 201
    created_class = class_resp.json()

    grade_three_problem = create_problem(
        client,
        teacher_tokens["accessToken"],
        problem_description="Grade 3 problem",
        grade=3,
    )
    grade_four_problem = create_problem(
        client,
        teacher_tokens["accessToken"],
        problem_description="Grade 4 problem",
        grade=4,
    )

    student_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        json={
            "email": unique_email("student-grade-filter"),
            "password": "studpw",
            "role": "student",
            "classId": created_class["id"],
        },
    )
    assert student_resp.status_code == 201
    student_token = student_resp.json()["accessToken"]
    client.cookies.clear()

    list_resp = client.get(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert list_resp.status_code == 200
    student_ids = {item["id"] for item in list_resp.json()["problems"]}
    assert grade_three_problem["id"] in student_ids
    assert grade_four_problem["id"] not in student_ids

    teacher_filter = client.get(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        params={"grade": 4},
    )
    assert teacher_filter.status_code == 200
    filtered_ids = {item["id"] for item in teacher_filter.json()["problems"]}
    assert filtered_ids == {grade_four_problem["id"]}


def test_teacher_can_delete_problem_and_admin_is_forbidden(client: TestClient) -> None:
    """Teachers can delete problems; admins are forbidden."""
    teacher_email, _ = create_teacher(
        client, login(client, "admin@example.com", "adminpw")["accessToken"]
    )
    teacher_tokens = login(client, teacher_email, "teachpw")
    created = create_problem(
        client,
        teacher_tokens["accessToken"],
        problem_description="Delete me",
        solution="N/A",
        difficulty="mittel",
        operations=["division"],
    )

    delete_resp = client.delete(
        f"/v1/math-problems/{created['id']}",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
    )
    assert delete_resp.status_code == 204

    admin_tokens = login(client, "admin@example.com", "adminpw")
    admin_delete = client.delete(
        f"/v1/math-problems/{created['id']}",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
    )
    assert admin_delete.status_code == 404 or admin_delete.status_code == 403

    list_resp = client.get("/v1/math-problems")
    assert list_resp.status_code == 200
    ids = {item["id"] for item in list_resp.json()["problems"]}
    assert created["id"] not in ids


def test_invalid_difficulty_rejected(client: TestClient) -> None:
    """Difficulty outside permitted range is rejected."""
    teacher_email, _ = create_teacher(
        client, login(client, "admin@example.com", "adminpw")["accessToken"]
    )
    teacher_tokens = login(client, teacher_email, "teachpw")
    response = client.post(
        "/v1/math-problems",
        headers={"Authorization": f"Bearer {teacher_tokens['accessToken']}"},
        json={
            "problemDescription": "Too hard?",
            "solution": "N/A",
            "difficulty": "unmoeglich",
            "grade": 3,
            "operations": ["addition"],
        },
    )
    assert response.status_code == 422


def unique_email(label: str) -> str:
    """Return a unique email address for tests."""
    return f"{label}-{uuid4().hex}@example.com"
