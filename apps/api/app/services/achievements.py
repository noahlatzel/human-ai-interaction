"""Achievement service for checking and unlocking achievements."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Literal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import UserAchievement, UserStatistics
from app.services.achievement_definitions import (
    ACHIEVEMENTS_BY_ID,
    ACHIEVEMENTS_BY_STAT,
    ACHIEVEMENT_DEFINITIONS,
    AchievementDefinition,
)


ExerciseSource = Literal["home_practice", "class_exercises", "own_exercises"]


def _now() -> datetime:
    """Return timezone-aware UTC now."""
    return datetime.now(timezone.utc)


async def get_or_create_statistics(
    session: AsyncSession, user_id: str
) -> UserStatistics:
    """Get or create user statistics record."""
    query = select(UserStatistics).where(UserStatistics.user_id == user_id)
    result = await session.execute(query)
    stats = result.scalar_one_or_none()

    if stats is None:
        stats = UserStatistics(
            id=str(uuid.uuid4()),
            user_id=user_id,
            home_practice_solved=0,
            class_exercises_solved=0,
            own_exercises_solved=0,
            total_solved=0,
        )
        session.add(stats)
        await session.flush()

    return stats


async def increment_solved_count(
    session: AsyncSession, user_id: str, source: ExerciseSource
) -> UserStatistics:
    """Increment the solved count for a specific source category."""
    stats = await get_or_create_statistics(session, user_id)

    # Increment the appropriate counter
    if source == "home_practice":
        stats.home_practice_solved += 1
    elif source == "class_exercises":
        stats.class_exercises_solved += 1
    elif source == "own_exercises":
        stats.own_exercises_solved += 1

    # Always increment total
    stats.total_solved += 1

    await session.flush()
    return stats


async def get_unlocked_achievement_ids(
    session: AsyncSession, user_id: str
) -> set[str]:
    """Get set of already unlocked achievement IDs for a user."""
    query = select(UserAchievement.achievement_id).where(
        UserAchievement.user_id == user_id
    )
    result = await session.execute(query)
    return set(result.scalars().all())


async def unlock_achievement(
    session: AsyncSession, user_id: str, achievement_id: str
) -> UserAchievement:
    """Create an achievement unlock record."""
    unlock = UserAchievement(
        id=str(uuid.uuid4()),
        user_id=user_id,
        achievement_id=achievement_id,
        unlocked_at=_now(),
    )
    session.add(unlock)
    await session.flush()
    return unlock


async def check_and_unlock_achievements(
    session: AsyncSession, user_id: str, stats: UserStatistics
) -> list[AchievementDefinition]:
    """
    Check all achievements against current statistics and unlock any newly earned ones.
    
    Returns list of newly unlocked achievements.
    """
    unlocked_ids = await get_unlocked_achievement_ids(session, user_id)
    newly_unlocked: list[AchievementDefinition] = []

    # Check each stat field that has associated achievements
    for stat_field, achievements in ACHIEVEMENTS_BY_STAT.items():
        current_value = getattr(stats, stat_field, 0)

        for achievement in achievements:
            # Skip if already unlocked
            if achievement.id in unlocked_ids:
                continue

            # Check if threshold is met
            if current_value >= achievement.threshold:
                await unlock_achievement(session, user_id, achievement.id)
                newly_unlocked.append(achievement)
                unlocked_ids.add(achievement.id)  # Prevent duplicate unlocks

    return newly_unlocked


async def get_user_achievements_with_progress(
    session: AsyncSession, user_id: str
) -> list[dict]:
    """
    Get all achievements with unlock status and progress for a user.
    
    Returns list of dicts with achievement info, progress, and unlock status.
    """
    stats = await get_or_create_statistics(session, user_id)
    unlocked_ids = await get_unlocked_achievement_ids(session, user_id)

    # Get unlock timestamps
    query = select(UserAchievement).where(UserAchievement.user_id == user_id)
    result = await session.execute(query)
    unlock_records = {ua.achievement_id: ua.unlocked_at for ua in result.scalars().all()}

    achievements_data = []
    for achievement in ACHIEVEMENT_DEFINITIONS:
        current_value = getattr(stats, achievement.stat_field, 0) if achievement.stat_field else 0
        is_unlocked = achievement.id in unlocked_ids

        achievements_data.append({
            "id": achievement.id,
            "title": achievement.title,
            "description": achievement.description,
            "icon": achievement.icon,
            "category": achievement.category.value,
            "rarity": achievement.rarity.value,
            "threshold": achievement.threshold,
            "progress": min(current_value, achievement.threshold),
            "unlocked": is_unlocked,
            "unlockedAt": unlock_records.get(achievement.id).isoformat() if is_unlocked and unlock_records.get(achievement.id) else None,
        })

    return achievements_data


async def get_user_statistics_summary(
    session: AsyncSession, user_id: str
) -> dict:
    """Get a summary of user statistics."""
    stats = await get_or_create_statistics(session, user_id)
    unlocked_ids = await get_unlocked_achievement_ids(session, user_id)

    return {
        "homePracticeSolved": stats.home_practice_solved,
        "classExercisesSolved": stats.class_exercises_solved,
        "ownExercisesSolved": stats.own_exercises_solved,
        "totalSolved": stats.total_solved,
        "achievementsUnlocked": len(unlocked_ids),
        "achievementsTotal": len(ACHIEVEMENT_DEFINITIONS),
    }


__all__ = [
    "ExerciseSource",
    "get_or_create_statistics",
    "increment_solved_count",
    "check_and_unlock_achievements",
    "get_user_achievements_with_progress",
    "get_user_statistics_summary",
]
