"""Service for calculating user learning streaks based on LearningSession activity."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import LearningSession


@dataclass
class WeeklyActivityDay:
    """Single day in the weekly activity calendar."""

    date: date
    day_of_week: str
    is_today: bool
    has_activity: bool


@dataclass
class StreakResult:
    """Calculated streak statistics for a user."""

    current_streak: int
    longest_streak: int
    weekly_activity: list[WeeklyActivityDay]
    activity_history: list[str]


def _get_active_dates(sessions: list[LearningSession]) -> set[date]:
    """Extract unique dates (UTC) from learning sessions."""
    return {session.started_at.date() for session in sessions}


def _calculate_current_streak(active_dates: set[date], today: date) -> int:
    """
    Calculate current streak: consecutive days backward from today.

    Returns 0 if today has no activity, otherwise counts back until a gap.
    """
    if today not in active_dates:
        return 0

    streak = 0
    current = today
    while current in active_dates:
        streak += 1
        current -= timedelta(days=1)

    return streak


def _calculate_longest_streak(active_dates: set[date]) -> int:
    """Calculate the longest consecutive streak in the entire history."""
    if not active_dates:
        return 0

    sorted_dates = sorted(active_dates)
    longest = 1
    current = 1

    for i in range(1, len(sorted_dates)):
        if sorted_dates[i] == sorted_dates[i - 1] + timedelta(days=1):
            current += 1
            longest = max(longest, current)
        else:
            current = 1

    return longest


def _get_current_week_range(today: date) -> tuple[date, date]:
    """
    Return (Monday, Sunday) of the current week containing today.

    Week starts on Monday (ISO week).
    """
    weekday = today.weekday()  # 0=Monday, 6=Sunday
    monday = today - timedelta(days=weekday)
    sunday = monday + timedelta(days=6)
    return monday, sunday


def _build_weekly_activity(
    active_dates: set[date], today: date
) -> list[WeeklyActivityDay]:
    """
    Build 7-day list (Mon-Sun) for the current week with activity flags.
    """
    monday, _ = _get_current_week_range(today)

    day_names = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

    result: list[WeeklyActivityDay] = []
    for i in range(7):
        current_date = monday + timedelta(days=i)
        result.append(
            WeeklyActivityDay(
                date=current_date,
                day_of_week=day_names[i],
                is_today=(current_date == today),
                has_activity=(current_date in active_dates),
            )
        )

    return result


async def calculate_streak(
    session: AsyncSession, user_id: str, *, now: datetime | None = None
) -> StreakResult:
    """
    Calculate current streak, longest streak, and weekly activity for a user.

    Args:
        session: Database session
        user_id: User ID to calculate streak for
        now: Optional override for current time (defaults to UTC now, for testing)

    Returns:
        StreakResult with current/longest streaks and weekly calendar
    """
    if now is None:
        now = datetime.now(timezone.utc)

    today = now.date()

    # Fetch all learning sessions for this user
    stmt = select(LearningSession).where(LearningSession.user_id == user_id)
    result = await session.execute(stmt)
    sessions = list(result.scalars().all())

    # Extract unique active dates
    active_dates = _get_active_dates(sessions)

    # Calculate streaks
    current_streak = _calculate_current_streak(active_dates, today)
    longest_streak = _calculate_longest_streak(active_dates)

    # Build weekly activity
    weekly_activity = _build_weekly_activity(active_dates, today)

    # Build full activity history (sorted ISO date strings)
    activity_history = sorted(d.isoformat() for d in active_dates)

    return StreakResult(
        current_streak=current_streak,
        longest_streak=longest_streak,
        weekly_activity=weekly_activity,
        activity_history=activity_history,
    )


__all__ = [
    "StreakResult",
    "WeeklyActivityDay",
    "calculate_streak",
]
