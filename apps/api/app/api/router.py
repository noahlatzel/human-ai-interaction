"""Root API router."""

from __future__ import annotations

from fastapi import APIRouter

from . import auth, guest, math_word_problems, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(guest.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(math_word_problems.router)

__all__ = ["api_router"]
