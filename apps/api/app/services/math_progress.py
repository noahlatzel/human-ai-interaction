"""Service helpers for tracking math word problem progress."""

from __future__ import annotations

from dataclasses import dataclass
from typing import cast, Literal, Optional
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
from app.services import achievements


# Source types for exercises
ExerciseSource = Literal["home_practice", "class_exercises", "own_exercises"]


@dataclass
class StudentProgressStats:
    """Aggregate progress for a single student."""

    student_id: str
    first_name: Optional[str]
    last_name: Optional[str]
    class_id: Optional[str]
    class_grade: Optional[int]
    class_label: Optional[str]
    solved: int
    total_problems: int

    @property
    def completion_rate(self) -> float:
        """Return solved/total as a float; zero when no problems exist."""
        if self.total_problems == 0:
            return 0.0
        return float(self.solved) / float(self.total_problems)


@dataclass
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
    source: ExerciseSource = "home_practice",
) -> MathWordProblemProgress:
    """Create or update a student's progress record for a problem."""
    stmt = select(MathWordProblemProgress).where(
        MathWordProblemProgress.student_id == student_id,
        MathWordProblemProgress.math_word_problem_id == problem_id,
    )
    result = await session.execute(stmt)
    record = result.scalar_one_or_none()

    # Check if it was already solved to avoid double counting XP
    was_already_solved = record is not None and record.success

    if record:
        record.success = success
    else:
        record = MathWordProblemProgress(
            id=str(uuid4()),
            math_word_problem_id=problem_id,
            student_id=student_id,
            success=success,
        )
        session.add(record)

    # If newly solved (success=True and wasn't already solved), award XP and update stats
    if success and not was_already_solved:
        # Fetch problem to get difficulty
        problem_stmt = select(MathWordProblem).where(MathWordProblem.id == problem_id)
        problem_result = await session.execute(problem_stmt)
        problem = problem_result.scalar_one_or_none()

        if problem:
            # Fetch user to update stats
            user_stmt = select(User).where(User.id == student_id)
            user_result = await session.execute(user_stmt)
            user = user_result.scalar_one_or_none()

            if user:
                user.solved_tasks += 1

                # Calculate XP based on difficulty
                xp_gain = 10  # Default/Einfach
                if str(problem.difficulty) == "mittel":
                    xp_gain = 20
                elif str(problem.difficulty) == "schwierig":
                    xp_gain = 30

                user.xp += xp_gain
                session.add(user)

                # Update statistics by source category
                stats = await achievements.increment_solved_count(
                    session, student_id, source
                )

                # Check and unlock any new achievements
                await achievements.check_and_unlock_achievements(
                    session, student_id, stats
                )

    await session.flush()
    await session.refresh(record)
    return record


async def get_solved_problem_ids(
    session: AsyncSession,
    student_id: str,
) -> set[str]:
    """Return set of problem IDs that the student has successfully solved."""
    query = select(MathWordProblemProgress.math_word_problem_id).where(
        MathWordProblemProgress.student_id == student_id,
        MathWordProblemProgress.success.is_(True),
    )
    result = await session.execute(query)
    return set(result.scalars().all())


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
        cast(int, row.grade): cast(int, row.count) for row in problem_counts_result
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
        grade = cast(int, row.class_grade) if row.class_grade is not None else None
        if grade is not None:
            grades_seen.add(grade)
        suffix = (
            (row.class_suffix or "").strip() if hasattr(row, "class_suffix") else ""
        )
        label = f"{grade}{suffix}" if grade is not None else None
        total_problems = problems_by_grade.get(grade, 0) if grade is not None else 0
        students.append(
            StudentProgressStats(
                student_id=row.id,
                first_name=row.first_name,
                last_name=row.last_name,
                class_id=row.class_id,
                class_grade=grade,
                class_label=label,
                solved=int(row.solved or 0),
                total_problems=total_problems,
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
