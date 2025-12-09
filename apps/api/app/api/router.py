"""Root API router."""

from __future__ import annotations

from fastapi import APIRouter

from . import auth, classes, discussions, guest, math_word_problems, notifications, progress, users, class_exercises

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(guest.router, prefix="/auth", tags=["auth"])
api_router.include_router(classes.router, tags=["classes"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(math_word_problems.router)
api_router.include_router(progress.router)
api_router.include_router(class_exercises.router)
api_router.include_router(discussions.router, prefix="/discussions", tags=["discussions"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

__all__ = ["api_router"]
