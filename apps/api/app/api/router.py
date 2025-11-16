"""Root API router."""

from __future__ import annotations

from fastapi import APIRouter

from . import auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

__all__ = ["api_router"]
