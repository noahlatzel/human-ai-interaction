"""OpenAI-backed math helper services."""

from __future__ import annotations

import asyncio
import json
from typing import Any

from openai import AsyncOpenAI

from app.api.schemas.math_analysis import Language, MathProblemAnalysis
from app.config import get_settings


def _get_openai_client() -> AsyncOpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise ValueError("OpenAI API key is not configured.")
    return AsyncOpenAI(api_key=settings.openai_api_key)


LANGUAGE_INSTRUCTIONS: dict[Language, dict[str, str]] = {
    "en": {
        "gradeLevel": "3rd-grade",
        "analyzeInstruction": "Analyze this 3rd-grade math word problem",
        "provideFeedback": (
            "Provide all suggestions, steps, and explanations in English, suitable "
            "for a 3rd-grade student (age 8-9)."
        ),
        "extractInstruction": (
            "Analyze this file (which could be an image or a PDF) of a 3rd-grade "
            "math worksheet."
        ),
    },
    "de": {
        "gradeLevel": "3. Klasse",
        "analyzeInstruction": "Analysiere diese Mathematik-Textaufgabe fuer die 3. Klasse",
        "provideFeedback": (
            "Gib alle Vorschlaege, Schritte und Erklaerungen auf Deutsch an, "
            "geeignet fuer einen Schueler der 3. Klasse (Alter 8-9 Jahre)."
        ),
        "extractInstruction": (
            "Analysiere diese Datei (die ein Bild oder PDF sein kann) eines "
            "Mathematik-Arbeitsblatts fuer die 3. Klasse."
        ),
    },
}


ANALYSIS_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "words": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "The original word from the text.",
                    },
                    "type": {
                        "type": "string",
                        "enum": ["number", "keyword", "object", "operation", "normal"],
                        "description": "The category of the word.",
                    },
                    "value": {
                        "type": "number",
                        "description": "The numeric value if the type is number.",
                        "nullable": True,
                    },
                    "explanation": {
                        "type": "string",
                        "description": (
                            "A brief, child-friendly explanation if it is a keyword "
                            "or operation."
                        ),
                        "nullable": True,
                    },
                },
                "required": ["text", "type"],
            },
        },
        "suggestion": {
            "type": "string",
            "description": (
                "A friendly, one-sentence suggestion for the student to get started."
            ),
        },
        "steps": {
            "type": "array",
            "items": {"type": "string"},
            "description": (
                "A simple, step-by-step plan in child-friendly language to solve "
                "the problem."
            ),
        },
        "finalAnswer": {
            "type": "number",
            "description": "The final numerical answer to the math problem.",
        },
        "calculation": {
            "type": "object",
            "description": (
                "The full calculation needed to get the final answer, represented "
                "as a sequence."
            ),
            "properties": {
                "parts": {
                    "type": "array",
                    "description": (
                        "An array of numbers and string operators representing the "
                        "calculation in order."
                    ),
                    "items": {"oneOf": [{"type": "number"}, {"type": "string"}]},
                }
            },
            "required": ["parts"],
        },
        "operations": {
            "type": "array",
            "items": {"type": "string", "enum": ["+", "-", "×", "÷"]},
            "description": "The mathematical symbols needed to solve the problem.",
        },
        "visualCue": {
            "type": "string",
            "description": (
                "A one-line sketch that represents the situation (text or emoji)."
            ),
        },
        "emojiMap": {
            "type": "object",
            "description": (
                "A mapping of object names (singular and plural) to appropriate "
                "emojis for visualization."
            ),
            "nullable": True,
        },
        "semanticStructure": {
            "type": "string",
            "enum": ["change", "combine", "compare", "equalize"],
            "description": (
                "Semantic structure: change, combine, compare, or equalize."
            ),
        },
        "unknownPosition": {
            "type": "string",
            "enum": ["result", "change", "start"],
            "description": "Position of the unknown.",
        },
        "numberOfOperations": {
            "type": "number",
            "description": "Number of mathematical operations needed to solve.",
        },
        "hasIrrelevantInfo": {
            "type": "boolean",
            "description": "Whether the problem contains irrelevant information.",
        },
        "irrelevantData": {
            "type": "array",
            "items": {"type": "string"},
            "description": "List of irrelevant information found in the problem.",
            "nullable": True,
        },
        "relationshipType": {
            "type": "string",
            "enum": ["part-whole", "comparison", "equal-groups"],
            "description": "The mathematical relationship type.",
        },
        "difficultyLevel": {
            "type": "string",
            "enum": ["easy", "medium", "hard"],
            "description": "Overall difficulty level.",
        },
        "cognitiveLoad": {
            "type": "number",
            "description": "Cognitive load rating from 1 (low) to 5 (high).",
        },
    },
    "required": [
        "words",
        "suggestion",
        "visualCue",
        "steps",
        "finalAnswer",
        "calculation",
        "operations",
        "semanticStructure",
        "unknownPosition",
        "numberOfOperations",
        "hasIrrelevantInfo",
        "relationshipType",
        "difficultyLevel",
        "cognitiveLoad",
    ],
    "additionalProperties": False,
}


async def extract_problems_from_image(
    image_base64: str,
    mime_type: str,
    language: Language = "en",
) -> list[str]:
    """Extract distinct math word problems from an image or PDF."""
    client = _get_openai_client()
    lang_instr = LANGUAGE_INSTRUCTIONS[language]

    response = await client.chat.completions.create(
        model="gpt-5",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"{lang_instr['extractInstruction']}\n"
                            "Identify each distinct math word problem.\n"
                            "Extract the full text of each problem accurately in the "
                            "original language.\n"
                            'Separate each problem with the delimiter "|||".\n'
                            "Do not include numbering or any other text outside of "
                            "the problems and the delimiter."
                        ),
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime_type};base64,{image_base64}"},
                    },
                ],
            }
        ],
    )

    text = (response.choices[0].message.content or "").strip()
    if not text:
        raise ValueError("No problems found.")

    problems = [chunk.strip() for chunk in text.split("|||") if chunk.strip()]
    if not problems:
        raise ValueError("No problems found.")
    return problems


async def analyze_math_problem(
    problem_text: str,
    language: Language = "en",
) -> MathProblemAnalysis:
    """Analyze a single math word problem."""
    client = _get_openai_client()
    lang_instr = LANGUAGE_INSTRUCTIONS[language]

    response = await client.chat.completions.create(
        model="gpt-5",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a math tutor assistant. Analyze the problem and return "
                    "valid JSON matching the schema."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"{lang_instr['analyzeInstruction']} with extreme care to ensure "
                    "mathematical accuracy AND proper classification.\n"
                    f"{lang_instr['provideFeedback']}\n\n"
                    "**CRITICAL INSTRUCTIONS:**\n"
                    "1. Word Analysis: Identify all numbers (digits or words), "
                    "keywords suggesting operations, and important objects.\n"
                    "2. Reason step-by-step before determining the final answer.\n"
                    "3. Calculation Parts Ordering:\n"
                    "   - For multiplication: base quantity FIRST, then multiplier.\n"
                    '     Example: 3 boxes with 6 marbles each -> [6, "×", 3].\n'
                    "   - For division: total amount FIRST, then divisor.\n"
                    '     Example: 24 pencils shared among 4 -> [24, "÷", 4].\n'
                    "   - Exclude irrelevant numbers from calculation parts.\n"
                    "4. Semantic Structure: change, combine, compare, or equalize.\n"
                    "5. Unknown Position: result, change, or start.\n"
                    "6. Relationship Type: part-whole, comparison, or equal-groups.\n"
                    "7. Irrelevant Information: identify and list if present.\n"
                    "8. Difficulty Level: easy, medium, or hard.\n"
                    "9. Cognitive Load: 1-5 rating.\n"
                    "10. Visual Cue: short sketch (text or emoji) matching the story.\n"
                    "11. Populate the schema with suggestion, steps, final answer, "
                    "calculation, and classifications.\n\n"
                    f'Problem: "{problem_text}"\n\n'
                    f"Output JSON strictly matching this schema: {json.dumps(ANALYSIS_SCHEMA)}"
                ),
            },
        ],
    )

    json_string = (response.choices[0].message.content or "").strip()
    if not json_string:
        raise ValueError("Empty response from OpenAI.")

    analysis = json.loads(json_string)
    return MathProblemAnalysis.model_validate(analysis)


async def analyze_math_problems_batch(
    problem_texts: list[str],
    language: Language = "en",
) -> list[MathProblemAnalysis]:
    """Analyze multiple problems in a single request."""
    client = _get_openai_client()
    lang_instr = LANGUAGE_INSTRUCTIONS[language]

    batch_schema = {
        "type": "object",
        "properties": {
            "analyses": {
                "type": "array",
                "items": ANALYSIS_SCHEMA,
                "description": (
                    "Array of problem analyses, one for each problem in the same order."
                ),
            }
        },
        "required": ["analyses"],
        "additionalProperties": False,
    }

    problems_list = "\n\n".join(
        f"PROBLEM {idx + 1}:\n{text}" for idx, text in enumerate(problem_texts)
    )

    response = await client.chat.completions.create(
        model="gpt-5",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a math tutor assistant. Analyze the problems and return "
                    "valid JSON matching the schema."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"{lang_instr['analyzeInstruction']} - analyze these "
                    f"{len(problem_texts)} problems with extreme care.\n"
                    f"{lang_instr['provideFeedback']}\n\n"
                    "**CRITICAL INSTRUCTIONS:**\n"
                    "1. Identify numbers, keywords, and objects for each problem.\n"
                    "2. Reason step-by-step for correctness.\n"
                    "3. Classify semantic structure, unknown position, relationship type.\n"
                    "4. Identify irrelevant information when present.\n"
                    "5. Assign difficulty level and cognitive load.\n"
                    "6. Provide a short visual cue and child-friendly steps.\n\n"
                    "Return analyses in the SAME ORDER as the problems below.\n\n"
                    f"{problems_list}\n\n"
                    f"Output JSON strictly matching this schema: {json.dumps(batch_schema)}"
                ),
            },
        ],
    )

    json_string = (response.choices[0].message.content or "").strip()
    if not json_string:
        raise ValueError("Empty response from OpenAI.")

    payload = json.loads(json_string)
    analyses = payload.get("analyses", [])
    return [MathProblemAnalysis.model_validate(item) for item in analyses]


def chunk_array(items: list[Any], chunk_size: int) -> list[list[Any]]:
    """Split a list into chunks."""
    return [items[i : i + chunk_size] for i in range(0, len(items), chunk_size)]


async def analyze_math_problems_with_batching(
    problem_texts: list[str],
    language: Language = "en",
) -> list[MathProblemAnalysis]:
    """Analyze problems in batches with fallback to individual analysis."""
    batch_size = 5
    delay_between_batches = 0.5

    batches = chunk_array(problem_texts, batch_size)
    all_analyses: list[MathProblemAnalysis] = []

    for index, batch in enumerate(batches):
        try:
            batch_analyses = await analyze_math_problems_batch(batch, language)
            all_analyses.extend(batch_analyses)
        except Exception:
            for problem_text in batch:
                analysis = await analyze_math_problem(problem_text, language)
                all_analyses.append(analysis)
                await asyncio.sleep(1.0)

        if index < len(batches) - 1:
            await asyncio.sleep(delay_between_batches)

    return all_analyses


async def analyze_drawing_with_openai(
    image_base64: str,
    problem_text: str,
    language: Language = "en",
) -> str:
    """Analyze a drawing associated with a math problem."""
    client = _get_openai_client()
    is_german = language == "de"

    system_prompt = (
        "Du bist Clippy, ein hilfreicher aber ehrlicher Lernbegleiter fuer "
        "Grundschueler (6-10 Jahre). Du analysierst die Zeichnung eines Kindes "
        "zu dieser Mathe-Aufgabe.\n"
        "1. Schau dir die Zeichnung sehr genau an und beschreibe, was du siehst.\n"
        "2. Wenn die Zeichnung leer ist, sage das freundlich aber ehrlich.\n"
        "3. Wenn die Zeichnung passt, lobe sie spezifisch.\n"
        "4. Wenn sie nicht passt, gib einen freundlichen Tipp.\n"
        "5. Sei ehrlich und erfinde keine Objekte.\n"
        "6. Max 2-3 Saetze, nutze Emojis.\n"
        "7. Verrate nicht die Loesung."
        if is_german
        else "You are Clippy, a helpful but honest learning companion for "
        "elementary students (ages 6-10). Analyze the child's drawing for this "
        "math problem.\n"
        "1. Describe what you actually see.\n"
        "2. If the drawing is empty, say so kindly.\n"
        "3. If it matches, praise it specifically.\n"
        "4. If it does not match, give a friendly tip.\n"
        "5. Be honest and do not invent objects.\n"
        "6. Max 2-3 sentences, use emojis.\n"
        "7. Do not reveal the solution."
    )

    image_url = (
        image_base64
        if image_base64.startswith("data:")
        else f"data:image/png;base64,{image_base64}"
    )

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f'Here is the math problem: "{problem_text}"\n'
                            "And here is the drawing:"
                        ),
                    },
                    {"type": "image_url", "image_url": {"url": image_url}},
                ],
            },
        ],
        max_tokens=150,
    )

    return response.choices[0].message.content or ""


async def generate_drawing_suggestions(
    problem_text: str,
    language: Language = "en",
) -> list[str]:
    """Generate drawing suggestions for visualizing a math problem."""
    client = _get_openai_client()
    is_german = language == "de"

    system_prompt = (
        "Du bist ein kreativer Lernhelfer fuer Grundschueler (6-10 Jahre). "
        "Gib genau einen Satz mit einer konkreten Zeichenanleitung zur Aufgabe. "
        "Beginne mit 'Zeichne' oder 'Male' und verrate nicht die Loesung."
        if is_german
        else "You are a creative learning helper for elementary students (ages 6-10). "
        "Return exactly one sentence with a concrete drawing instruction. "
        "Start with 'Draw' or 'Sketch' and do not reveal the solution."
    )

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f'Math problem: "{problem_text}"'},
        ],
        max_tokens=100,
        temperature=0.7,
    )

    suggestion = (response.choices[0].message.content or "").strip()
    if suggestion:
        return [suggestion]
    return [
        "Draw the objects from the problem"
        if not is_german
        else "Zeichne die Objekte aus der Aufgabe"
    ]


async def get_metacognitive_coaching_response(
    problem_text: str,
    conversation_history: list[dict[str, str]],
    student_message: str,
    language: Language = "en",
) -> str:
    """Return a metacognitive coaching response for the student."""
    client = _get_openai_client()
    is_german = language == "de"

    history_text = "\n".join(
        f"{'Clippy' if msg.get('role') == 'tutor' else 'Student'}: {msg.get('content')}"
        for msg in conversation_history
    )

    system_prompt = (
        "Du bist Clippy! Ein super freundlicher Helfer fuer Kinder in der 3./4. "
        "Klasse (8-9 Jahre). Du stellst Fragen und gibst keine Loesungen."
        if is_german
        else "You're Clippy! A super friendly helper for 3rd/4th graders (age 8-9). "
        "You ask questions and do not give solutions."
    )

    prompt = (
        f"{system_prompt}\n\n"
        f"DIE MATHE-AUFGABE:\n{problem_text}\n\n"
        f"UNSER GESPRAECH BISHER:\n{history_text}\n\n"
        f"NEUE NACHRICHT VOM KIND:\nStudent: {student_message}\n\n"
        "Antworte als Clippy! Stelle eine Frage oder gib Ermutigung."
        if is_german
        else f"{system_prompt}\n\n"
        f"THE MATH PROBLEM:\n{problem_text}\n\n"
        f"OUR CONVERSATION SO FAR:\n{history_text}\n\n"
        f"NEW MESSAGE FROM KID:\nStudent: {student_message}\n\n"
        "Respond as Clippy! Ask a question or encourage the student."
    )

    response = await client.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
    )

    return response.choices[0].message.content or ""


async def analyze_multiplication_context(
    problem_text: str,
    segments: list[dict[str, Any]],
) -> dict[str, Any]:
    """Identify which segment is the base quantity and which is the multiplier."""
    client = _get_openai_client()
    segments_description = "\n".join(
        f"Segment {idx + 1}: {segment['count']} {segment['label']} "
        f"(emoji: {segment['emoji']})"
        for idx, segment in enumerate(segments)
    )

    prompt = (
        "You are analyzing a multiplication word problem to determine which object "
        "is being asked about.\n\n"
        f"PROBLEM TEXT:\n{problem_text}\n\n"
        f"AVAILABLE SEGMENTS:\n{segments_description}\n\n"
        "Return your answer in this JSON format:\n"
        '{ "targetLabel": "marbles", "reasoning": "..." }'
    )

    response = await client.chat.completions.create(
        model="gpt-5",
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )

    json_string = (response.choices[0].message.content or "").strip()
    if not json_string:
        raise ValueError("Empty response from OpenAI.")

    result = json.loads(json_string)
    target_label = str(result.get("targetLabel", "")).lower()

    target_segment = next(
        (
            segment
            for segment in segments
            if target_label in segment["label"].lower()
            or segment["label"].lower() in target_label
        ),
        None,
    )

    if not target_segment and segments:
        target_segment = segments[0]

    multiplier_segment = next(
        (segment for segment in segments if segment is not target_segment),
        None,
    )

    return {
        "targetLabel": target_segment["label"] if target_segment else "",
        "targetCount": target_segment["count"] if target_segment else 0,
        "targetEmoji": target_segment["emoji"] if target_segment else "[]",
        "factor": multiplier_segment["count"] if multiplier_segment else 1,
    }


__all__ = [
    "ANALYSIS_SCHEMA",
    "LANGUAGE_INSTRUCTIONS",
    "analyze_drawing_with_openai",
    "analyze_math_problem",
    "analyze_math_problems_batch",
    "analyze_math_problems_with_batching",
    "analyze_multiplication_context",
    "extract_problems_from_image",
    "generate_drawing_suggestions",
    "get_metacognitive_coaching_response",
]
