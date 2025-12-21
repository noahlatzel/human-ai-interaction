"""Routes for OpenAI-powered math helper functions."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import require_roles
from app.services import openai_math_helper

from .schemas.math_helper import (
    AnalyzeBatchRequest,
    AnalyzeBatchResponse,
    AnalyzeDrawingRequest,
    AnalyzeDrawingResponse,
    AnalyzeProblemRequest,
    AnalyzeProblemResponse,
    DrawingSuggestionsRequest,
    DrawingSuggestionsResponse,
    ExtractProblemsRequest,
    ExtractProblemsResponse,
    MetacognitiveRequest,
    MetacognitiveResponse,
    MultiplicationContextRequest,
    MultiplicationContextResponse,
)

router = APIRouter(prefix="/math-helper", tags=["math-helper"])


@router.post(
    "/extract",
    response_model=ExtractProblemsResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def extract_problems(payload: ExtractProblemsRequest) -> ExtractProblemsResponse:
    """Extract math problems from an uploaded image or PDF."""
    try:
        problems = await openai_math_helper.extract_problems_from_image(
            payload.image_base64,
            payload.mime_type,
            payload.language,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return ExtractProblemsResponse(problems=problems)


@router.post(
    "/analyze",
    response_model=AnalyzeProblemResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def analyze_problem(payload: AnalyzeProblemRequest) -> AnalyzeProblemResponse:
    """Analyze a single math word problem."""
    try:
        analysis = await openai_math_helper.analyze_math_problem(
            payload.problem_text, payload.language
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return AnalyzeProblemResponse(analysis=analysis)


@router.post(
    "/analyze-batch",
    response_model=AnalyzeBatchResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def analyze_batch(payload: AnalyzeBatchRequest) -> AnalyzeBatchResponse:
    """Analyze multiple math word problems in a single request."""
    try:
        analyses = await openai_math_helper.analyze_math_problems_batch(
            payload.problem_texts, payload.language
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return AnalyzeBatchResponse(analyses=analyses)


@router.post(
    "/analyze-batched",
    response_model=AnalyzeBatchResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def analyze_batched(payload: AnalyzeBatchRequest) -> AnalyzeBatchResponse:
    """Analyze multiple math problems with batching and fallback."""
    try:
        analyses = await openai_math_helper.analyze_math_problems_with_batching(
            payload.problem_texts, payload.language
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return AnalyzeBatchResponse(analyses=analyses)


@router.post(
    "/drawing-feedback",
    response_model=AnalyzeDrawingResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def analyze_drawing(payload: AnalyzeDrawingRequest) -> AnalyzeDrawingResponse:
    """Analyze a student's drawing for a math problem."""
    try:
        feedback = await openai_math_helper.analyze_drawing_with_openai(
            payload.image_base64, payload.problem_text, payload.language
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return AnalyzeDrawingResponse(feedback=feedback)


@router.post(
    "/drawing-suggestions",
    response_model=DrawingSuggestionsResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def drawing_suggestions(
    payload: DrawingSuggestionsRequest,
) -> DrawingSuggestionsResponse:
    """Return drawing suggestions for a problem."""
    try:
        suggestions = await openai_math_helper.generate_drawing_suggestions(
            payload.problem_text, payload.language
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return DrawingSuggestionsResponse(suggestions=suggestions)


@router.post(
    "/metacognitive",
    response_model=MetacognitiveResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def metacognitive_response(
    payload: MetacognitiveRequest,
) -> MetacognitiveResponse:
    """Return a metacognitive coaching response."""
    try:
        response = await openai_math_helper.get_metacognitive_coaching_response(
            payload.problem_text,
            [msg.model_dump() for msg in payload.conversation_history],
            payload.student_message,
            payload.language,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return MetacognitiveResponse(response=response)


@router.post(
    "/multiplication-context",
    response_model=MultiplicationContextResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("student"))],
)
async def multiplication_context(
    payload: MultiplicationContextRequest,
) -> MultiplicationContextResponse:
    """Analyze multiplication context for visualization."""
    try:
        result = await openai_math_helper.analyze_multiplication_context(
            payload.problem_text,
            [segment.model_dump() for segment in payload.segments],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    return MultiplicationContextResponse.model_validate(result)


__all__ = ["router"]
