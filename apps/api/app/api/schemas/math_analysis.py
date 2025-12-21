"""Shared schemas for math problem analysis."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Language = Literal["en", "de"]


class AnalyzedWord(BaseModel):
    """Token-level analysis for a single word."""

    text: str
    type: Literal["number", "keyword", "object", "operation", "normal"]
    value: float | None = None
    explanation: str | None = None


class Calculation(BaseModel):
    """Calculation parts for the analyzed problem."""

    parts: list[float | int | str]


class MathProblemAnalysis(BaseModel):
    """Structured analysis for a math word problem."""

    model_config = ConfigDict(populate_by_name=True)

    words: list[AnalyzedWord]
    suggestion: str
    visual_cue: str = Field(alias="visualCue")
    emoji_map: dict[str, str] | None = Field(default=None, alias="emojiMap")
    steps: list[str]
    final_answer: float = Field(alias="finalAnswer")
    calculation: Calculation
    operations: list[Literal["+", "-", "×", "÷"]]
    semantic_structure: Literal["change", "combine", "compare", "equalize"] = Field(
        alias="semanticStructure"
    )
    unknown_position: Literal["result", "change", "start"] = Field(
        alias="unknownPosition"
    )
    number_of_operations: int = Field(alias="numberOfOperations")
    has_irrelevant_info: bool = Field(alias="hasIrrelevantInfo")
    irrelevant_data: list[str] | None = Field(default=None, alias="irrelevantData")
    relationship_type: Literal["part-whole", "comparison", "equal-groups"] = Field(
        alias="relationshipType"
    )
    difficulty_level: Literal["easy", "medium", "hard"] = Field(alias="difficultyLevel")
    cognitive_load: int = Field(alias="cognitiveLoad")


__all__ = [
    "AnalyzedWord",
    "Calculation",
    "Language",
    "MathProblemAnalysis",
]
