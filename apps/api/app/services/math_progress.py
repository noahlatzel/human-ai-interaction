"""Service helpers for tracking math word problem progress."""

from __future__ import annotations

from dataclasses import dataclass
from uuid import uuid4

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
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
    total_result = await session.execute(select(func.count(MathWordProblem.id)))
    total_problems = int(total_result.scalar_one() or 0)

    filters: list = [User.role == "student"]
    if teacher_id:
        filters.append(User.teacher_id == teacher_id)

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
            progress_subquery.c.solved,
        )
        .select_from(User)
        .outerjoin(progress_subquery, User.id == progress_subquery.c.student_id)
        .where(*filters)
    )
    result = await session.execute(stmt)

    students: list[StudentProgressStats] = []
    for row in result:
        students.append(
            StudentProgressStats(
                student_id=row.id,
                first_name=row.first_name,
                last_name=row.last_name,
                solved=int(row.solved or 0),
                total_problems=total_problems,
            )
        )

    return ProgressSummary(total_problems=total_problems, students=students)


__all__ = [
    "ProgressSummary",
    "StudentProgressStats",
    "set_progress",
    "summarize_progress",
]
