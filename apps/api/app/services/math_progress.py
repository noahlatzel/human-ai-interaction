"""Service helpers for tracking math word problem progress."""

from __future__ import annotations

from dataclasses import dataclass
from uuid import uuid4

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    Classroom,
    ClassType,
    MathWordProblem,
    MathWordProblemProgress,
    User,
)


@dataclass(slots=True)
class StudentProgressStats:
    """Aggregate progress for a single student."""

    student_id: str
    first_name: str | None
    last_name: str | None
    class_id: str | None
    class_grade: int | None
    class_label: str | None
    solved: int
    total_problems: int

    @property
    def completion_rate(self) -> float:
        """Return solved/total as a float; zero when no problems exist."""
        if self.total_problems == 0:
            return 0.0
        return float(self.solved) / float(self.total_problems)


@dataclass(slots=True)
class ProgressSummary:
    """Overall progress summary for a cohort of students."""

    total_problems: int
    students: list[StudentProgressStats]


async def set_progress(
    session: AsyncSession,
    *,
    student_id: str,
    problem_id: str,
    success: bool,
) -> MathWordProblemProgress:
    """Create or update a student's progress record for a problem."""
    stmt = select(MathWordProblemProgress).where(
        MathWordProblemProgress.student_id == student_id,
        MathWordProblemProgress.math_word_problem_id == problem_id,
    )
    result = await session.execute(stmt)
    record = result.scalar_one_or_none()

    if record:
        record.success = success
        return record

    record = MathWordProblemProgress(
        id=str(uuid4()),
        math_word_problem_id=problem_id,
        student_id=student_id,
        success=success,
    )
    session.add(record)
    await session.flush()
    await session.refresh(record)
    return record


async def summarize_progress(
    session: AsyncSession,
    *,
    teacher_id: str | None,
) -> ProgressSummary:
    """Return solved counts per student and total problems count."""
    problem_counts_result = await session.execute(
        select(MathWordProblem.grade, func.count(MathWordProblem.id)).group_by(
            MathWordProblem.grade
        )
    )
    problems_by_grade: dict[int, int] = {
        int(row.grade): int(row.count) for row in problem_counts_result
    }

    progress_subquery = (
        select(
            MathWordProblemProgress.student_id.label("student_id"),
            func.coalesce(
                func.sum(
                    case(
                        (MathWordProblemProgress.success.is_(True), 1),
                        else_=0,
                    )
                ),
                0,
            ).label("solved"),
        )
        .group_by(MathWordProblemProgress.student_id)
        .subquery()
    )

    stmt = (
        select(
            User.id,
            User.first_name,
            User.last_name,
            Classroom.id.label("class_id"),
            Classroom.grade.label("class_grade"),
            Classroom.suffix.label("class_suffix"),
            progress_subquery.c.solved,
        )
        .select_from(User)
        .join(Classroom, User.class_id == Classroom.id, isouter=True)
        .outerjoin(progress_subquery, User.id == progress_subquery.c.student_id)
    )
    conditions = [User.role == "student"]
    if teacher_id:
        conditions.extend(
            [
                Classroom.class_type == ClassType.TEACHER,
                Classroom.teacher_id == teacher_id,
            ]
        )
    stmt = stmt.where(*conditions)
    result = await session.execute(stmt)

    students: list[StudentProgressStats] = []
    grades_seen: set[int] = set()
    for row in result:
        grade = int(row.class_grade) if row.class_grade is not None else None
        if grade is not None:
            grades_seen.add(grade)
        suffix = (
            (row.class_suffix or "").strip() if hasattr(row, "class_suffix") else ""
        )
        label = f"{grade}{suffix}" if grade is not None else None
        students.append(
            StudentProgressStats(
                student_id=row.id,
                first_name=row.first_name,
                last_name=row.last_name,
                class_id=row.class_id,
                class_grade=grade,
                class_label=label,
                solved=int(row.solved or 0),
                total_problems=problems_by_grade.get(grade, 0),
            )
        )

    total_problems = (
        max((problems_by_grade.get(grade, 0) for grade in grades_seen), default=0)
        if students
        else 0
    )
    return ProgressSummary(total_problems=total_problems, students=students)


__all__ = [
    "ProgressSummary",
    "StudentProgressStats",
    "set_progress",
    "summarize_progress",
]
