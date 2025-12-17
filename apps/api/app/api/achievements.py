"""Routes for user achievements."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import AuthContext, require_roles
from app.dependencies import get_db_session
from app.services import achievements


router = APIRouter(prefix="/achievements", tags=["achievements"])


class AchievementResponse(BaseModel):
    """Single achievement with progress and unlock status."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    title: str
    description: str
    icon: str
    category: str
    rarity: str
    threshold: int
    progress: int
    unlocked: bool
    unlocked_at: str | None = Field(alias="unlockedAt", default=None)


class AchievementsListResponse(BaseModel):
    """List of all achievements with progress."""

    model_config = ConfigDict(populate_by_name=True)

    achievements: list[AchievementResponse]
    total_unlocked: int = Field(alias="totalUnlocked")
    total_achievements: int = Field(alias="totalAchievements")


class StatisticsSummaryResponse(BaseModel):
    """Summary of user statistics."""

    model_config = ConfigDict(populate_by_name=True)

    home_practice_solved: int = Field(alias="homePracticeSolved")
    class_exercises_solved: int = Field(alias="classExercisesSolved")
    own_exercises_solved: int = Field(alias="ownExercisesSolved")
    total_solved: int = Field(alias="totalSolved")
    achievements_unlocked: int = Field(alias="achievementsUnlocked")
    achievements_total: int = Field(alias="achievementsTotal")


@router.get("", response_model=AchievementsListResponse)
async def list_achievements(
    actor: AuthContext = Depends(require_roles("student")),
    session: AsyncSession = Depends(get_db_session),
) -> AchievementsListResponse:
    """Get all achievements with unlock status and progress for the current user."""
    achievements_data = await achievements.get_user_achievements_with_progress(
        session, actor.uid
    )

    unlocked_count = sum(1 for a in achievements_data if a["unlocked"])

    return AchievementsListResponse.model_validate(
        {
            "achievements": [
                AchievementResponse.model_validate(
                    {
                        "id": a["id"],
                        "title": a["title"],
                        "description": a["description"],
                        "icon": a["icon"],
                        "category": a["category"],
                        "rarity": a["rarity"],
                        "threshold": a["threshold"],
                        "progress": a["progress"],
                        "unlocked": a["unlocked"],
                        "unlockedAt": a["unlockedAt"],
                    }
                )
                for a in achievements_data
            ],
            "totalUnlocked": unlocked_count,
            "totalAchievements": len(achievements_data),
        }
    )


@router.get("/statistics", response_model=StatisticsSummaryResponse)
async def get_statistics(
    actor: AuthContext = Depends(require_roles("student")),
    session: AsyncSession = Depends(get_db_session),
) -> StatisticsSummaryResponse:
    """Get statistics summary for the current user."""
    summary = await achievements.get_user_statistics_summary(session, actor.uid)
    return StatisticsSummaryResponse.model_validate(summary)
