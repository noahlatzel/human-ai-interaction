"""Classroom persistence helpers."""

from __future__ import annotations

from typing import Iterable
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Classroom, ClassType, User

SUPPORTED_GRADES: tuple[int, ...] = (3, 4)


def _validate_grade(grade: int) -> int:
    """Ensure grade is within supported bounds."""
    if grade not in SUPPORTED_GRADES:
        raise ValueError(f"Grade must be one of {SUPPORTED_GRADES}.")
    return grade


def _normalize_suffix(suffix: str | None) -> str:
    """Trim and validate class suffix."""
    normalized = (suffix or "").strip()
    if len(normalized) > 16:
        raise ValueError("Class suffix must be 16 characters or fewer.")
    return normalized


async def _get_user(session: AsyncSession, user_id: str | None) -> User | None:
    """Return the user by id when present."""
    if not user_id:
        return None
    return await session.get(User, user_id)


async def _require_teacher(session: AsyncSession, teacher_id: str) -> User:
    """Return the teacher or raise ValueError when missing/invalid."""
    teacher = await _get_user(session, teacher_id)
    if teacher is None or teacher.role != "teacher":
        raise ValueError("Teacher not found")
    return teacher


async def create_class(
    session: AsyncSession,
    *,
    teacher_id: str | None,
    grade: int,
    suffix: str = "",
    class_type: ClassType = ClassType.TEACHER,
) -> Classroom:
    """Create a new classroom for a teacher or system flow."""
    normalized_grade = _validate_grade(grade)
    normalized_suffix = _normalize_suffix(suffix)
    teacher: User | None = None
    if class_type == ClassType.TEACHER:
        teacher = await _require_teacher(session, teacher_id or "")
    elif teacher_id:
        teacher = await _get_user(session, teacher_id)

    classroom = Classroom(
        id=str(uuid4()),
        teacher_id=teacher.id if teacher else None,
        grade=normalized_grade,
        suffix=normalized_suffix,
        class_type=class_type,
    )
    session.add(classroom)
    await session.flush()
    await session.refresh(classroom)
    return classroom


async def list_classes_for_teacher(
    session: AsyncSession, teacher_id: str
) -> list[Classroom]:
    """Return classrooms owned by the provided teacher."""
    await _require_teacher(session, teacher_id)
    stmt = (
        select(Classroom)
        .options(selectinload(Classroom.students))
        .where(
            Classroom.teacher_id == teacher_id,
            Classroom.class_type == ClassType.TEACHER,
        )
        .order_by(Classroom.grade, Classroom.suffix)
    )
    result = await session.execute(stmt)
    return list(result.scalars().unique().all())


async def get_class_by_id(session: AsyncSession, class_id: str) -> Classroom | None:
    """Return a class by id."""
    return await session.get(Classroom, class_id)


async def get_user_with_class(session: AsyncSession, user_id: str) -> User | None:
    """Return a user by id with their class_id populated."""
    if not user_id:
        return None
    return await session.get(User, user_id)


async def get_teacher_class_by_id(
    session: AsyncSession,
    *,
    class_id: str,
    teacher_id: str,
) -> Classroom | None:
    """Return the class if it belongs to the teacher."""
    stmt = (
        select(Classroom)
        .where(
            Classroom.id == class_id,
            Classroom.teacher_id == teacher_id,
            Classroom.class_type == ClassType.TEACHER,
        )
        .options(selectinload(Classroom.students))
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def ensure_system_class(
    session: AsyncSession,
    *,
    grade: int,
    class_type: ClassType,
) -> Classroom:
    """Return or create a system-owned class (solo/guest) for a grade."""
    if class_type not in (ClassType.SOLO, ClassType.GUEST):
        raise ValueError("System classes must be solo or guest.")
    normalized_grade = _validate_grade(grade)
    stmt = select(Classroom).where(
        Classroom.grade == normalized_grade,
        Classroom.class_type == class_type,
        Classroom.suffix == "",
        Classroom.teacher_id.is_(None),
    )
    result = await session.execute(stmt)
    existing = result.scalar_one_or_none()
    if existing:
        return existing
    classroom = Classroom(
        id=str(uuid4()),
        teacher_id=None,
        grade=normalized_grade,
        suffix="",
        class_type=class_type,
    )
    session.add(classroom)
    await session.flush()
    await session.refresh(classroom)
    return classroom


async def add_student_to_class(
    session: AsyncSession, student: User, classroom: Classroom
) -> User:
    """Assign a student to a class and return the updated user."""
    student.class_id = classroom.id
    await session.flush()
    await session.refresh(student)
    return student


async def ensure_teacher_owns_class(
    session: AsyncSession, *, class_id: str, teacher_id: str
) -> Classroom:
    """Return the class or raise ValueError when ownership fails."""
    classroom = await get_teacher_class_by_id(
        session, class_id=class_id, teacher_id=teacher_id
    )
    if classroom is None:
        raise ValueError("Class not found")
    return classroom


def supported_grades() -> Iterable[int]:
    """Expose supported grades for callers."""
    return SUPPORTED_GRADES


__all__ = [
    "SUPPORTED_GRADES",
    "add_student_to_class",
    "create_class",
    "ensure_system_class",
    "ensure_teacher_owns_class",
    "get_class_by_id",
    "get_teacher_class_by_id",
    "get_user_with_class",
    "list_classes_for_teacher",
    "supported_grades",
]
