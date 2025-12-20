"""Schemas for math helper OpenAI endpoints."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from app.api.schemas.math_analysis import Language, MathProblemAnalysis


class ExtractProblemsRequest(BaseModel):
    image_base64: str = Field(alias="imageBase64", min_length=1)
    mime_type: str = Field(alias="mimeType", min_length=1)
    language: Language = "en"


class ExtractProblemsResponse(BaseModel):
    problems: list[str]


class AnalyzeProblemRequest(BaseModel):
    problem_text: str = Field(alias="problemText", min_length=1)
    language: Language = "en"


class AnalyzeProblemResponse(BaseModel):
    analysis: MathProblemAnalysis


class AnalyzeBatchRequest(BaseModel):
    problem_texts: list[str] = Field(alias="problemTexts", min_length=1)
    language: Language = "en"


class AnalyzeBatchResponse(BaseModel):
    analyses: list[MathProblemAnalysis]


class AnalyzeDrawingRequest(BaseModel):
    image_base64: str = Field(alias="imageBase64", min_length=1)
    problem_text: str = Field(alias="problemText", min_length=1)
    language: Language = "en"


class AnalyzeDrawingResponse(BaseModel):
    feedback: str


class DrawingSuggestionsRequest(BaseModel):
    problem_text: str = Field(alias="problemText", min_length=1)
    language: Language = "en"


class DrawingSuggestionsResponse(BaseModel):
    suggestions: list[str]


class ConversationMessage(BaseModel):
    role: Literal["student", "tutor"]
    content: str


class MetacognitiveRequest(BaseModel):
    problem_text: str = Field(alias="problemText", min_length=1)
    conversation_history: list[ConversationMessage] = Field(
        alias="conversationHistory", default_factory=list
    )
    student_message: str = Field(alias="studentMessage", min_length=1)
    language: Language = "en"


class MetacognitiveResponse(BaseModel):
    response: str


class MultiplicationSegment(BaseModel):
    label: str
    count: int
    emoji: str


class MultiplicationContextRequest(BaseModel):
    problem_text: str = Field(alias="problemText", min_length=1)
    segments: list[MultiplicationSegment]


class MultiplicationContextResponse(BaseModel):
    target_label: str = Field(alias="targetLabel")
    target_count: int = Field(alias="targetCount")
    target_emoji: str = Field(alias="targetEmoji")
    factor: int


__all__ = [
    "AnalyzeBatchRequest",
    "AnalyzeBatchResponse",
    "AnalyzeDrawingRequest",
    "AnalyzeDrawingResponse",
    "AnalyzeProblemRequest",
    "AnalyzeProblemResponse",
    "ConversationMessage",
    "DrawingSuggestionsRequest",
    "DrawingSuggestionsResponse",
    "ExtractProblemsRequest",
    "ExtractProblemsResponse",
    "MetacognitiveRequest",
    "MetacognitiveResponse",
    "MultiplicationContextRequest",
    "MultiplicationContextResponse",
    "MultiplicationSegment",
]
