"""Shared schemas that are not tied to FastAPI."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Optional

from app.models import User


@dataclass(slots=True)
class AuthContext:
    """Authenticated user context extracted from an access token."""

    user: User
    claims: Optional[Mapping[str, Any]] = None
    session_id: str | None = None
    learning_session_id: str | None = None

    @property
    def role(self) -> str:
        """Return the role stored on the user."""
        return self.user.role

    @property
    def uid(self) -> str:
        """Return the user id for convenience."""
        return self.user.id


__all__ = ["AuthContext"]
