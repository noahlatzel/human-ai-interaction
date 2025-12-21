"""Seed data for math word problems."""

from __future__ import annotations

from typing import Any

TEST_EXERCISES: list[dict[str, Any]] = [
    {
        "problem_text": (
            "Thomas has 3 apples. He buys 5 more apples. "
            "How many apples does Thomas have now?"
        ),
        "analysis": {
            "words": [
                {"text": "3", "type": "number", "value": 3},
                {
                    "text": "+",
                    "type": "operation",
                    "explanation": "Adding numbers together",
                },
                {"text": "5", "type": "number", "value": 5},
            ],
            "suggestion": "Add the two numbers together!",
            "visualCue": "●●● + ●●●●●",
            "steps": ["Start with 3", "Add 5 more", "Count the total"],
            "finalAnswer": 8,
            "calculation": {"parts": [3, "+", 5]},
            "operations": ["+"],
            "semanticStructure": "combine",
            "unknownPosition": "result",
            "numberOfOperations": 1,
            "hasIrrelevantInfo": False,
            "relationshipType": "part-whole",
            "difficultyLevel": "easy",
            "cognitiveLoad": 1,
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "easy",
    },
    {
        "problem_text": (
            "Sarah has 12 apples. She gives 5 apples to her friend. "
            "How many apples does Sarah have left?"
        ),
        "analysis": {
            "words": [
                {"text": "Sarah", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "12", "type": "number", "value": 12},
                {"text": "apples", "type": "object"},
                {"text": "She", "type": "normal"},
                {
                    "text": "gives",
                    "type": "keyword",
                    "explanation": "This tells us we're taking away",
                },
                {"text": "5", "type": "number", "value": 5},
                {"text": "apples", "type": "object"},
                {"text": "to", "type": "normal"},
                {"text": "her", "type": "normal"},
                {"text": "friend", "type": "normal"},
                {"text": "How", "type": "normal"},
                {"text": "many", "type": "normal"},
                {"text": "apples", "type": "object"},
                {"text": "does", "type": "normal"},
                {"text": "Sarah", "type": "normal"},
                {"text": "have", "type": "normal"},
                {
                    "text": "left",
                    "type": "keyword",
                    "explanation": "Finding what remains after taking some away",
                },
            ],
            "suggestion": (
                "Try drawing the apples and crossing out the ones Sarah gives away!"
            ),
            "visualCue": "🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎 → ✖️✖️✖️✖️✖️",
            "steps": [
                "Start with 12 apples",
                "Take away 5 apples",
                "Count how many are left",
            ],
            "finalAnswer": 7,
            "calculation": {"parts": [12, "-", 5]},
            "operations": ["-"],
            "semanticStructure": "change",
            "unknownPosition": "result",
            "numberOfOperations": 1,
            "hasIrrelevantInfo": False,
            "relationshipType": "part-whole",
            "difficultyLevel": "easy",
            "cognitiveLoad": 2,
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "easy",
    },
    {
        "problem_text": (
            "A bakery made 24 cupcakes in the morning and 18 cupcakes in the "
            "afternoon. They sold 30 cupcakes. How many cupcakes are left?"
        ),
        "analysis": {
            "words": [
                {"text": "A", "type": "normal"},
                {"text": "bakery", "type": "normal"},
                {
                    "text": "made",
                    "type": "keyword",
                    "explanation": "Creating or adding things",
                },
                {"text": "24", "type": "number", "value": 24},
                {"text": "cupcakes", "type": "object"},
                {"text": "in", "type": "normal"},
                {"text": "the", "type": "normal"},
                {"text": "morning", "type": "normal"},
                {
                    "text": "and",
                    "type": "operation",
                    "explanation": "Combining amounts",
                },
                {"text": "18", "type": "number", "value": 18},
                {"text": "cupcakes", "type": "object"},
                {"text": "in", "type": "normal"},
                {"text": "the", "type": "normal"},
                {"text": "afternoon", "type": "normal"},
                {"text": "They", "type": "normal"},
                {
                    "text": "sold",
                    "type": "keyword",
                    "explanation": "Taking away or removing",
                },
                {"text": "30", "type": "number", "value": 30},
                {"text": "cupcakes", "type": "object"},
                {"text": "How", "type": "normal"},
                {"text": "many", "type": "normal"},
                {"text": "cupcakes", "type": "object"},
                {"text": "are", "type": "normal"},
                {
                    "text": "left",
                    "type": "keyword",
                    "explanation": "Finding what remains",
                },
            ],
            "suggestion": (
                "First, add up all the cupcakes they made, then subtract how many "
                "they sold!"
            ),
            "visualCue": "🧁🧁🧁...24 + 🧁🧁🧁...18 - 🧁🧁🧁...30",
            "steps": [
                "Add the morning cupcakes and afternoon cupcakes together",
                "Subtract the cupcakes that were sold",
                "Count the remaining cupcakes",
            ],
            "finalAnswer": 12,
            "calculation": {"parts": [24, "+", 18, "-", 30]},
            "operations": ["+", "-"],
            "semanticStructure": "change",
            "unknownPosition": "result",
            "numberOfOperations": 2,
            "hasIrrelevantInfo": False,
            "relationshipType": "part-whole",
            "difficultyLevel": "medium",
            "cognitiveLoad": 3,
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "medium",
    },
    {
        "problem_text": (
            "There are 6 marbles in a box. Tom has 3 boxes. His friend has 7 "
            "marbles. How many marbles does Tom have in total?"
        ),
        "analysis": {
            "words": [
                {"text": "There", "type": "normal"},
                {"text": "are", "type": "normal"},
                {"text": "6", "type": "number", "value": 6},
                {"text": "marbles", "type": "object"},
                {"text": "in", "type": "normal"},
                {"text": "a", "type": "normal"},
                {"text": "box", "type": "object"},
                {"text": "Tom", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "3", "type": "number", "value": 3},
                {"text": "boxes", "type": "object"},
                {"text": "His", "type": "normal"},
                {"text": "friend", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "7", "type": "number", "value": 7},
                {"text": "marbles", "type": "object"},
                {"text": "How", "type": "normal"},
                {"text": "many", "type": "normal"},
                {"text": "marbles", "type": "object"},
                {"text": "does", "type": "normal"},
                {"text": "Tom", "type": "normal"},
                {"text": "have", "type": "normal"},
                {"text": "in", "type": "normal"},
                {
                    "text": "total",
                    "type": "keyword",
                    "explanation": "Finding the complete amount",
                },
            ],
            "suggestion": (
                "Start with 6 marbles per box and multiply by how many boxes Tom "
                "has. Don't count the friend's marbles!"
            ),
            "visualCue": "📦(🔵🔵🔵🔵🔵🔵) × 3",
            "steps": [
                "Find how many marbles are in each box (6)",
                "Multiply by the number of boxes Tom has (3)",
                "Remember: the friend's marbles don't count for Tom's total!",
            ],
            "finalAnswer": 18,
            "calculation": {"parts": [6, "×", 3]},
            "operations": ["×"],
            "semanticStructure": "combine",
            "unknownPosition": "result",
            "numberOfOperations": 1,
            "hasIrrelevantInfo": True,
            "irrelevantData": ["His friend has 7 marbles"],
            "relationshipType": "equal-groups",
            "difficultyLevel": "medium",
            "cognitiveLoad": 3,
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "medium",
    },
    {
        "problem_text": (
            "Tom has 3 boxes. There are 6 marbles in a box. His friend has 7 "
            "marbles. How many marbles does Tom have in total?"
        ),
        "analysis": {
            "words": [
                {"text": "Tom", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "3", "type": "number", "value": 3},
                {"text": "boxes", "type": "object"},
                {"text": "There", "type": "normal"},
                {"text": "are", "type": "normal"},
                {"text": "6", "type": "number", "value": 6},
                {"text": "marbles", "type": "object"},
                {"text": "in", "type": "normal"},
                {"text": "a", "type": "normal"},
                {"text": "box", "type": "object"},
                {"text": "His", "type": "normal"},
                {"text": "friend", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "7", "type": "number", "value": 7},
                {"text": "marbles", "type": "object"},
                {"text": "How", "type": "normal"},
                {"text": "many", "type": "normal"},
                {"text": "marbles", "type": "object"},
                {"text": "does", "type": "normal"},
                {"text": "Tom", "type": "normal"},
                {"text": "have", "type": "normal"},
                {"text": "in", "type": "normal"},
                {
                    "text": "total",
                    "type": "keyword",
                    "explanation": "Finding the complete amount",
                },
            ],
            "suggestion": (
                "Start with 6 marbles per box and multiply by how many boxes Tom "
                "has. Don't count the friend's marbles!"
            ),
            "visualCue": "📦(🔵🔵🔵🔵🔵🔵) × 3",
            "steps": [
                "Find how many marbles are in each box (6)",
                "Multiply by the number of boxes Tom has (3)",
                "Remember: the friend's marbles don't count for Tom's total!",
            ],
            "finalAnswer": 18,
            "calculation": {"parts": [6, "×", 3]},
            "operations": ["×"],
            "semanticStructure": "combine",
            "unknownPosition": "result",
            "numberOfOperations": 1,
            "hasIrrelevantInfo": True,
            "irrelevantData": ["His friend has 7 marbles"],
            "relationshipType": "equal-groups",
            "difficultyLevel": "medium",
            "cognitiveLoad": 3,
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "medium",
    },
    {
        "problem_text": (
            "A teacher has 24 pencils. She wants to distribute them among 4 "
            "students. How many pencils does each student get?"
        ),
        "analysis": {
            "words": [
                {"text": "A", "type": "normal"},
                {"text": "teacher", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "24", "type": "number", "value": 24},
                {"text": "pencils", "type": "object"},
                {"text": "She", "type": "normal"},
                {"text": "wants", "type": "normal"},
                {"text": "to", "type": "normal"},
                {
                    "text": "distribute",
                    "type": "keyword",
                    "explanation": "Splitting into equal groups",
                },
                {"text": "them", "type": "normal"},
                {
                    "text": "among",
                    "type": "normal",
                    "explanation": "Sharing between multiple people",
                },
                {"text": "4", "type": "number", "value": 4},
                {"text": "students", "type": "object"},
                {"text": "How", "type": "normal"},
                {"text": "many", "type": "normal"},
                {"text": "pencils", "type": "object"},
                {"text": "does", "type": "normal"},
                {
                    "text": "each",
                    "type": "keyword",
                    "explanation": "Looking for the amount per group",
                },
                {"text": "student", "type": "object"},
                {"text": "get", "type": "normal"},
            ],
            "suggestion": (
                "Try grouping the pencils into 4 equal piles, one for each student!"
            ),
            "visualCue": "✏️✏️✏️...24 ÷ 4 students",
            "steps": [
                "Start with 24 pencils",
                "Divide them into 4 equal groups",
                "Count how many pencils are in each group",
            ],
            "finalAnswer": 6,
            "calculation": {"parts": [24, "÷", 4]},
            "operations": ["÷"],
            "semanticStructure": "combine",
            "unknownPosition": "result",
            "numberOfOperations": 1,
            "hasIrrelevantInfo": False,
            "relationshipType": "equal-groups",
            "difficultyLevel": "medium",
            "cognitiveLoad": 3,
            "emojiMap": {"pencils": "✏️", "students": "👨‍🎓"},
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "medium",
    },
    {
        "problem_text": (
            "A teacher has 4 students. Amongst them, she wants to distribute 24 "
            "pencils. How many pencils does each student get?"
        ),
        "analysis": {
            "words": [
                {"text": "A", "type": "normal"},
                {"text": "teacher", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "4", "type": "number", "value": 4},
                {"text": "students", "type": "object"},
                {
                    "text": "Amongst",
                    "type": "normal",
                    "explanation": "Sharing between multiple people",
                },
                {"text": "them", "type": "normal"},
                {"text": "she", "type": "normal"},
                {"text": "wants", "type": "normal"},
                {"text": "to", "type": "normal"},
                {
                    "text": "distribute",
                    "type": "keyword",
                    "explanation": "Splitting into equal groups",
                },
                {"text": "24", "type": "number", "value": 24},
                {"text": "pencils", "type": "object"},
                {"text": "How", "type": "normal"},
                {"text": "many", "type": "normal"},
                {"text": "pencils", "type": "object"},
                {"text": "does", "type": "normal"},
                {
                    "text": "each",
                    "type": "keyword",
                    "explanation": "Looking for the amount per group",
                },
                {"text": "student", "type": "object"},
                {"text": "get", "type": "normal"},
            ],
            "suggestion": (
                "Try grouping the pencils into 4 equal piles, one for each student!"
            ),
            "visualCue": "✏️✏️✏️...24 ÷ 4 students",
            "steps": [
                "Start with 24 pencils",
                "Divide them into 4 equal groups",
                "Count how many pencils are in each group",
            ],
            "finalAnswer": 6,
            "calculation": {"parts": [24, "÷", 4]},
            "operations": ["÷"],
            "semanticStructure": "combine",
            "unknownPosition": "result",
            "numberOfOperations": 1,
            "hasIrrelevantInfo": False,
            "relationshipType": "equal-groups",
            "difficultyLevel": "medium",
            "cognitiveLoad": 3,
            "emojiMap": {"pencils": "✏️", "students": "👨‍🎓"},
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "medium",
    },
    {
        "problem_text": (
            "Lisa had some stickers. She gave 8 stickers to her brother. Now she "
            "has 15 stickers left. How many stickers did Lisa have at first?"
        ),
        "analysis": {
            "words": [
                {"text": "Lisa", "type": "normal"},
                {"text": "had", "type": "normal"},
                {
                    "text": "some",
                    "type": "keyword",
                    "explanation": "This is what we need to find",
                },
                {"text": "stickers", "type": "object"},
                {"text": "She", "type": "normal"},
                {
                    "text": "gave",
                    "type": "keyword",
                    "explanation": "Taking away or subtracting",
                },
                {"text": "8", "type": "number", "value": 8},
                {"text": "stickers", "type": "object"},
                {"text": "to", "type": "normal"},
                {"text": "her", "type": "normal"},
                {"text": "brother", "type": "normal"},
                {"text": "Now", "type": "normal"},
                {"text": "she", "type": "normal"},
                {"text": "has", "type": "normal"},
                {"text": "15", "type": "number", "value": 15},
                {"text": "stickers", "type": "object"},
                {
                    "text": "left",
                    "type": "keyword",
                    "explanation": "What remains after giving away",
                },
                {"text": "How", "type": "normal"},
                {"text": "many", "type": "normal"},
                {"text": "stickers", "type": "object"},
                {"text": "did", "type": "normal"},
                {"text": "Lisa", "type": "normal"},
                {"text": "have", "type": "normal"},
                {"text": "at", "type": "normal"},
                {
                    "text": "first",
                    "type": "keyword",
                    "explanation": "The starting amount",
                },
            ],
            "suggestion": (
                "Think backwards! If she has 15 now after giving away 8, what did "
                "she start with?"
            ),
            "visualCue": "? - 8 = 15",
            "steps": [
                "We know she has 15 stickers now",
                "She gave away 8 stickers to get to 15",
                "Add the 8 stickers back to find how many she started with",
            ],
            "finalAnswer": 23,
            "calculation": {"parts": [15, "+", 8]},
            "operations": ["+"],
            "semanticStructure": "change",
            "unknownPosition": "start",
            "numberOfOperations": 1,
            "hasIrrelevantInfo": False,
            "relationshipType": "part-whole",
            "difficultyLevel": "hard",
            "cognitiveLoad": 4,
        },
        "grade": 3,
        "language": "en",
        "difficulty_level": "hard",
    },
]

__all__ = ["TEST_EXERCISES"]
