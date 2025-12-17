"""Service for student own exercises."""

from __future__ import annotations

import base64
from typing import Optional
from uuid import uuid4

from openai import AsyncOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.student_own_exercises import (
    ImageProcessResponse,
    StudentOwnExerciseCreate,
    StudentOwnExerciseUpdate,
)
from app.config import get_settings
from app.models import StudentOwnExercise


async def create_exercise(
    db: AsyncSession,
    user_id: str,
    data: StudentOwnExerciseCreate,
) -> StudentOwnExercise:
    """Create a new student own exercise."""
    exercise = StudentOwnExercise(
        id=str(uuid4()),
        user_id=user_id,
        problem=data.problem,
        difficulty=data.difficulty,
        answer=data.answer,
        grade=data.grade,
        question_type=data.question_type,
        metric=data.metric,
        steps=data.steps,
        image_path=data.image_path,
    )
    db.add(exercise)
    await db.commit()
    await db.refresh(exercise)
    return exercise


async def get_exercises_for_user(
    db: AsyncSession,
    user_id: str,
) -> list[StudentOwnExercise]:
    """Get all exercises for a user."""
    result = await db.execute(
        select(StudentOwnExercise)
        .where(StudentOwnExercise.user_id == user_id)
        .order_by(StudentOwnExercise.created_at.desc())
    )
    return list(result.scalars().all())


async def get_exercise_by_id(
    db: AsyncSession,
    exercise_id: str,
    user_id: str,
) -> Optional[StudentOwnExercise]:
    """Get a specific exercise by ID, verify ownership."""
    result = await db.execute(
        select(StudentOwnExercise).where(
            StudentOwnExercise.id == exercise_id,
            StudentOwnExercise.user_id == user_id,
        )
    )
    return result.scalar_one_or_none()


async def update_exercise(
    db: AsyncSession,
    exercise_id: str,
    user_id: str,
    data: StudentOwnExerciseUpdate,
) -> Optional[StudentOwnExercise]:
    """Update an exercise, verify ownership."""
    exercise = await get_exercise_by_id(db, exercise_id, user_id)
    if not exercise:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exercise, field, value)

    await db.commit()
    await db.refresh(exercise)
    return exercise


async def delete_exercise(
    db: AsyncSession,
    exercise_id: str,
    user_id: str,
) -> bool:
    """Delete an exercise, verify ownership."""
    exercise = await get_exercise_by_id(db, exercise_id, user_id)
    if not exercise:
        return False

    await db.delete(exercise)
    await db.commit()
    return True


async def process_image_mock() -> ImageProcessResponse:
    """Mock image processing with 2-second delay."""
    import asyncio
    await asyncio.sleep(2)

    return ImageProcessResponse(
        problem="Ein Bauer hat 24 Äpfel. Er gibt 8 Äpfel an seine Nachbarin. Wie viele Äpfel hat er noch?",
        difficulty="leicht",
        grade="3. Klasse",
        question_type="Subtraktion",
        answer=16.0,
        metric="Äpfel",
        steps="1. Start: 24 Äpfel\n2. Weggenommen: 8 Äpfel\n3. Rechnung: 24 - 8 = 16\n4. Antwort: 16 Äpfel",
    )


async def process_image_with_openai(image_bytes: bytes) -> ImageProcessResponse:
    """Process image using OpenAI Vision API."""
    settings = get_settings()
    
    if not settings.openai_api_key or settings.openai_api_key == "your-openai-api-key-here":
        # Fallback to mock if no API key configured
        print("⚠️  No OpenAI API key configured, using mock data")
        return await process_image_mock()
    
    print(f"🔑 Using OpenAI API key: {settings.openai_api_key[:10]}...")
    
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    
    # Encode image to base64
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    print(f"📷 Image encoded, size: {len(image_bytes)} bytes")
    
    prompt = """Analysiere dieses Bild einer mathematischen Textaufgabe für Grundschüler.

Extrahiere folgende Informationen und gib sie im JSON-Format zurück:
- problem: Der vollständige Aufgabentext
- difficulty: "leicht", "mittel" oder "schwer"
- grade: Klassenstufe (z.B. "3. Klasse")
- question_type: Art der Aufgabe (z.B. "Addition", "Subtraktion", "Multiplikation", "Division")
- answer: Die numerische Antwort (nur die Zahl)
- metric: Die Maßeinheit/Objekte (z.B. "Äpfel", "Euro", "Meter")
- steps: Lösungsschritte nummeriert (z.B. "1. ...\n2. ...\n3. ...")

Antworte NUR mit einem JSON-Objekt in diesem Format:
{
  "problem": "...",
  "difficulty": "leicht",
  "grade": "3. Klasse",
  "question_type": "Addition",
  "answer": 42,
  "metric": "Äpfel",
  "steps": "1. ...\n2. ...\n3. ..."
}"""
    
    try:
        print(f"🤖 Calling OpenAI with model: gpt-4o-mini")
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=1000,
            temperature=0.3,
        )
        
        print(f"✅ OpenAI response received")
        content = response.choices[0].message.content
        if not content:
            raise ValueError("Empty response from OpenAI")
        
        print(f"📝 Response content: {content[:200]}...")
        
        # Parse JSON from response
        import json
        # Remove markdown code blocks if present
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        data = json.loads(content)
        print(f"✅ Successfully parsed JSON response")
        
        return ImageProcessResponse(
            problem=data.get("problem", ""),
            difficulty=data.get("difficulty", "mittel"),
            grade=data.get("grade", ""),
            question_type=data.get("question_type", ""),
            answer=float(data.get("answer", 0)),
            metric=data.get("metric", ""),
            steps=data.get("steps", ""),
        )
    except Exception as e:
        # On error, return mock data
        print(f"❌ OpenAI Vision error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        print("⚠️  Falling back to mock data")
        return await process_image_mock()


__all__ = [
    "create_exercise",
    "get_exercises_for_user",
    "get_exercise_by_id",
    "update_exercise",
    "delete_exercise",
    "process_image_mock",
    "process_image_with_openai",
]
