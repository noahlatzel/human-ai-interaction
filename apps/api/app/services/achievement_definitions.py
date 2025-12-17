"""Achievement definitions and constants."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class AchievementCategory(str, Enum):
    """Categories for achievements."""

    HOME_PRACTICE = "home_practice"
    CLASS_EXERCISES = "class_exercises"
    OWN_EXERCISES = "own_exercises"
    TOTAL = "total"
    STREAK = "streak"
    SPECIAL = "special"


class AchievementRarity(str, Enum):
    """Rarity levels for achievements."""

    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    DIAMOND = "diamond"


@dataclass(frozen=True)
class AchievementDefinition:
    """Definition of an achievement."""

    id: str
    title: str
    description: str
    icon: str
    category: AchievementCategory
    rarity: AchievementRarity
    threshold: int  # Number required to unlock
    stat_field: str | None = None  # Which UserStatistics field to check


# Achievement definitions by category and threshold
# Rarity mapping: 5→Bronze, 10→Bronze, 25→Silber, 50→Gold, 75→Gold, 100→Diamant

ACHIEVEMENT_DEFINITIONS: list[AchievementDefinition] = [
    # === HOME PRACTICE ===
    AchievementDefinition(
        id="home_practice_5",
        title="Erste Schritte",
        description="Löse 5 Aufgaben bei Zuhause üben",
        icon="🏠",
        category=AchievementCategory.HOME_PRACTICE,
        rarity=AchievementRarity.BRONZE,
        threshold=5,
        stat_field="home_practice_solved",
    ),
    AchievementDefinition(
        id="home_practice_10",
        title="Fleißig zu Hause",
        description="Löse 10 Aufgaben bei Zuhause üben",
        icon="🏠",
        category=AchievementCategory.HOME_PRACTICE,
        rarity=AchievementRarity.BRONZE,
        threshold=10,
        stat_field="home_practice_solved",
    ),
    AchievementDefinition(
        id="home_practice_25",
        title="Heimlerner",
        description="Löse 25 Aufgaben bei Zuhause üben",
        icon="🏠",
        category=AchievementCategory.HOME_PRACTICE,
        rarity=AchievementRarity.SILVER,
        threshold=25,
        stat_field="home_practice_solved",
    ),
    AchievementDefinition(
        id="home_practice_50",
        title="Übungsweltmeister",
        description="Löse 50 Aufgaben bei Zuhause üben",
        icon="🏠",
        category=AchievementCategory.HOME_PRACTICE,
        rarity=AchievementRarity.GOLD,
        threshold=50,
        stat_field="home_practice_solved",
    ),
    AchievementDefinition(
        id="home_practice_75",
        title="Mathe-Experte",
        description="Löse 75 Aufgaben bei Zuhause üben",
        icon="🏠",
        category=AchievementCategory.HOME_PRACTICE,
        rarity=AchievementRarity.GOLD,
        threshold=75,
        stat_field="home_practice_solved",
    ),
    AchievementDefinition(
        id="home_practice_100",
        title="Mathe-Legende",
        description="Löse 100 Aufgaben bei Zuhause üben",
        icon="🏠",
        category=AchievementCategory.HOME_PRACTICE,
        rarity=AchievementRarity.DIAMOND,
        threshold=100,
        stat_field="home_practice_solved",
    ),
    # === CLASS EXERCISES ===
    AchievementDefinition(
        id="class_exercises_5",
        title="Klassenstarter",
        description="Löse 5 Klassenübungen",
        icon="📚",
        category=AchievementCategory.CLASS_EXERCISES,
        rarity=AchievementRarity.BRONZE,
        threshold=5,
        stat_field="class_exercises_solved",
    ),
    AchievementDefinition(
        id="class_exercises_10",
        title="Fleißiger Schüler",
        description="Löse 10 Klassenübungen",
        icon="📚",
        category=AchievementCategory.CLASS_EXERCISES,
        rarity=AchievementRarity.BRONZE,
        threshold=10,
        stat_field="class_exercises_solved",
    ),
    AchievementDefinition(
        id="class_exercises_25",
        title="Klassenprofi",
        description="Löse 25 Klassenübungen",
        icon="📚",
        category=AchievementCategory.CLASS_EXERCISES,
        rarity=AchievementRarity.SILVER,
        threshold=25,
        stat_field="class_exercises_solved",
    ),
    AchievementDefinition(
        id="class_exercises_50",
        title="Hausaufgaben-Held",
        description="Löse 50 Klassenübungen",
        icon="📚",
        category=AchievementCategory.CLASS_EXERCISES,
        rarity=AchievementRarity.GOLD,
        threshold=50,
        stat_field="class_exercises_solved",
    ),
    AchievementDefinition(
        id="class_exercises_75",
        title="Musterschüler",
        description="Löse 75 Klassenübungen",
        icon="📚",
        category=AchievementCategory.CLASS_EXERCISES,
        rarity=AchievementRarity.GOLD,
        threshold=75,
        stat_field="class_exercises_solved",
    ),
    AchievementDefinition(
        id="class_exercises_100",
        title="Klassenbester",
        description="Löse 100 Klassenübungen",
        icon="📚",
        category=AchievementCategory.CLASS_EXERCISES,
        rarity=AchievementRarity.DIAMOND,
        threshold=100,
        stat_field="class_exercises_solved",
    ),
    # === OWN EXERCISES ===
    AchievementDefinition(
        id="own_exercises_5",
        title="Kreativ-Starter",
        description="Löse 5 eigene Aufgaben",
        icon="✏️",
        category=AchievementCategory.OWN_EXERCISES,
        rarity=AchievementRarity.BRONZE,
        threshold=5,
        stat_field="own_exercises_solved",
    ),
    AchievementDefinition(
        id="own_exercises_10",
        title="Selbstlerner",
        description="Löse 10 eigene Aufgaben",
        icon="✏️",
        category=AchievementCategory.OWN_EXERCISES,
        rarity=AchievementRarity.BRONZE,
        threshold=10,
        stat_field="own_exercises_solved",
    ),
    AchievementDefinition(
        id="own_exercises_25",
        title="Eigene Wege",
        description="Löse 25 eigene Aufgaben",
        icon="✏️",
        category=AchievementCategory.OWN_EXERCISES,
        rarity=AchievementRarity.SILVER,
        threshold=25,
        stat_field="own_exercises_solved",
    ),
    AchievementDefinition(
        id="own_exercises_50",
        title="Kreativ-Meister",
        description="Löse 50 eigene Aufgaben",
        icon="✏️",
        category=AchievementCategory.OWN_EXERCISES,
        rarity=AchievementRarity.GOLD,
        threshold=50,
        stat_field="own_exercises_solved",
    ),
    AchievementDefinition(
        id="own_exercises_75",
        title="Aufgaben-Künstler",
        description="Löse 75 eigene Aufgaben",
        icon="✏️",
        category=AchievementCategory.OWN_EXERCISES,
        rarity=AchievementRarity.GOLD,
        threshold=75,
        stat_field="own_exercises_solved",
    ),
    AchievementDefinition(
        id="own_exercises_100",
        title="Mathe-Erfinder",
        description="Löse 100 eigene Aufgaben",
        icon="✏️",
        category=AchievementCategory.OWN_EXERCISES,
        rarity=AchievementRarity.DIAMOND,
        threshold=100,
        stat_field="own_exercises_solved",
    ),
    # === TOTAL ===
    AchievementDefinition(
        id="total_5",
        title="Erster Schritt",
        description="Löse insgesamt 5 Aufgaben",
        icon="🎯",
        category=AchievementCategory.TOTAL,
        rarity=AchievementRarity.BRONZE,
        threshold=5,
        stat_field="total_solved",
    ),
    AchievementDefinition(
        id="total_10",
        title="Fleißiger Anfänger",
        description="Löse insgesamt 10 Aufgaben",
        icon="🎯",
        category=AchievementCategory.TOTAL,
        rarity=AchievementRarity.BRONZE,
        threshold=10,
        stat_field="total_solved",
    ),
    AchievementDefinition(
        id="total_25",
        title="Aufgaben-Sammler",
        description="Löse insgesamt 25 Aufgaben",
        icon="🎯",
        category=AchievementCategory.TOTAL,
        rarity=AchievementRarity.SILVER,
        threshold=25,
        stat_field="total_solved",
    ),
    AchievementDefinition(
        id="total_50",
        title="Mathe-Champion",
        description="Löse insgesamt 50 Aufgaben",
        icon="🎯",
        category=AchievementCategory.TOTAL,
        rarity=AchievementRarity.GOLD,
        threshold=50,
        stat_field="total_solved",
    ),
    AchievementDefinition(
        id="total_75",
        title="Aufgaben-König",
        description="Löse insgesamt 75 Aufgaben",
        icon="🎯",
        category=AchievementCategory.TOTAL,
        rarity=AchievementRarity.GOLD,
        threshold=75,
        stat_field="total_solved",
    ),
    AchievementDefinition(
        id="total_100",
        title="Unaufhaltsam",
        description="Löse insgesamt 100 Aufgaben",
        icon="🎯",
        category=AchievementCategory.TOTAL,
        rarity=AchievementRarity.DIAMOND,
        threshold=100,
        stat_field="total_solved",
    ),
]

# Create lookup dictionary for quick access
ACHIEVEMENTS_BY_ID: dict[str, AchievementDefinition] = {
    achievement.id: achievement for achievement in ACHIEVEMENT_DEFINITIONS
}

# Group achievements by stat field for efficient checking
ACHIEVEMENTS_BY_STAT: dict[str, list[AchievementDefinition]] = {}
for achievement in ACHIEVEMENT_DEFINITIONS:
    if achievement.stat_field:
        if achievement.stat_field not in ACHIEVEMENTS_BY_STAT:
            ACHIEVEMENTS_BY_STAT[achievement.stat_field] = []
        ACHIEVEMENTS_BY_STAT[achievement.stat_field].append(achievement)


__all__ = [
    "AchievementCategory",
    "AchievementRarity",
    "AchievementDefinition",
    "ACHIEVEMENT_DEFINITIONS",
    "ACHIEVEMENTS_BY_ID",
    "ACHIEVEMENTS_BY_STAT",
]
