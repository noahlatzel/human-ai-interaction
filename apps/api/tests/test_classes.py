from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from tests.test_auth_flow import _login, unique_email


def _create_class(client: TestClient, token: str, grade: int = 3, suffix: str = "a"):
    """Helper to create a class for a teacher."""
    response = client.post(
        "/v1/classes",
        headers={"Authorization": f"Bearer {token}"},
        json={"grade": grade, "suffix": suffix},
    )
    assert response.status_code == 201
    return response.json()


def test_teacher_create_and_list_classes(client: TestClient) -> None:
    """Teachers can create classes and see student counts."""
    teacher_email = unique_email("class-teacher")
    register_resp = client.post(
        "/v1/auth/register",
        json={"email": teacher_email, "password": "teachpw", "role": "teacher"},
    )
    assert register_resp.status_code == 201
    teacher_token = register_resp.json()["accessToken"]

    first_class = _create_class(client, teacher_token, grade=3, suffix="a")
    _create_class(client, teacher_token, grade=4, suffix="b")

    list_resp = client.get(
        "/v1/classes",
        headers={"Authorization": f"Bearer {teacher_token}"},
    )
    assert list_resp.status_code == 200
    classes = list_resp.json()["classes"]
    assert len(classes) == 2
    counts = {cls["id"]: cls["studentCount"] for cls in classes}
    assert counts[first_class["id"]] == 0

    student_resp = client.post(
        "/v1/auth/register",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "email": unique_email("class-student"),
            "password": "studpw",
            "role": "student",
            "classId": first_class["id"],
        },
    )
    assert student_resp.status_code == 201
    client.cookies.clear()

    refreshed = client.get(
        "/v1/classes",
        headers={"Authorization": f"Bearer {teacher_token}"},
    )
    assert refreshed.status_code == 200
    refreshed_counts = {
        cls["id"]: cls["studentCount"] for cls in refreshed.json()["classes"]
    }
    assert refreshed_counts[first_class["id"]] == 1


def test_add_student_to_class_endpoint(client: TestClient) -> None:
    """Teacher can add students directly to a class via dedicated endpoint."""
    teacher_email = unique_email("class-student-add")
    teacher_resp = client.post(
        "/v1/auth/register",
        json={"email": teacher_email, "password": "teachpw", "role": "teacher"},
    )
    assert teacher_resp.status_code == 201
    teacher_token = teacher_resp.json()["accessToken"]
    created_class = _create_class(client, teacher_token, grade=3, suffix="c")

    create_resp = client.post(
        f"/v1/classes/{created_class['id']}/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "email": f"{uuid4().hex}@example.com",
            "password": "studpw",
            "role": "student",
            "firstName": "Alex",
        },
    )
    assert create_resp.status_code == 201
    body = create_resp.json()
    assert body["user"]["classId"] == created_class["id"]
    assert body["user"]["classGrade"] == 3


def test_classes_forbidden_for_admin_and_students(client: TestClient) -> None:
    """Admins and students cannot manage classes."""
    admin_tokens = _login(client, "admin@example.com", "adminpw")
    admin_create = client.post(
        "/v1/classes",
        headers={"Authorization": f"Bearer {admin_tokens['accessToken']}"},
        json={"grade": 3, "suffix": "z"},
    )
    assert admin_create.status_code == 403

    student_email = unique_email("class-student-role")
    client.cookies.clear()
    student_resp = client.post(
        "/v1/auth/register",
        json={
            "email": student_email,
            "password": "studpw",
            "role": "student",
            "grade": 3,
        },
    )
    assert student_resp.status_code == 201
    student_token = student_resp.json()["accessToken"]

    student_create = client.post(
        "/v1/classes",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"grade": 3, "suffix": "z"},
    )
    assert student_create.status_code == 403


def test_teacher_can_delete_student_from_class(client: TestClient) -> None:
    """Teachers can remove students from their own class."""
    teacher_email = unique_email("class-teacher-delete")
    teacher_resp = client.post(
        "/v1/auth/register",
        json={"email": teacher_email, "password": "teachpw", "role": "teacher"},
    )
    assert teacher_resp.status_code == 201
    teacher_token = teacher_resp.json()["accessToken"]
    created_class = _create_class(client, teacher_token, grade=3, suffix="d")

    create_resp = client.post(
        f"/v1/classes/{created_class['id']}/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "email": f"{uuid4().hex}@example.com",
            "password": "studpw",
            "role": "student",
            "firstName": "Casey",
        },
    )
    assert create_resp.status_code == 201
    student_id = create_resp.json()["user"]["id"]

    roster_resp = client.get(
        f"/v1/classes/{created_class['id']}/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
    )
    assert roster_resp.status_code == 200
    assert len(roster_resp.json()["students"]) == 1

    delete_resp = client.delete(
        f"/v1/classes/{created_class['id']}/students/{student_id}",
        headers={"Authorization": f"Bearer {teacher_token}"},
    )
    assert delete_resp.status_code == 204

    refreshed_roster = client.get(
        f"/v1/classes/{created_class['id']}/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
    )
    assert refreshed_roster.status_code == 200
    assert refreshed_roster.json()["students"] == []


def test_teacher_cannot_delete_student_from_other_class(client: TestClient) -> None:
    """Teachers cannot remove students from classes they do not own."""
    primary_resp = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("primary-teacher"),
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert primary_resp.status_code == 201
    primary_token = primary_resp.json()["accessToken"]
    class_a = _create_class(client, primary_token, grade=3, suffix="e")

    student_resp = client.post(
        f"/v1/classes/{class_a['id']}/students",
        headers={"Authorization": f"Bearer {primary_token}"},
        json={
            "email": f"{uuid4().hex}@example.com",
            "password": "studpw",
            "role": "student",
        },
    )
    assert student_resp.status_code == 201
    student_id = student_resp.json()["user"]["id"]

    other_resp = client.post(
        "/v1/auth/register",
        json={
            "email": unique_email("other-teacher"),
            "password": "teachpw",
            "role": "teacher",
        },
    )
    assert other_resp.status_code == 201
    other_token = other_resp.json()["accessToken"]
    other_class = _create_class(client, other_token, grade=3, suffix="f")

    delete_resp = client.delete(
        f"/v1/classes/{other_class['id']}/students/{student_id}",
        headers={"Authorization": f"Bearer {other_token}"},
    )
    assert delete_resp.status_code == 404
