"""User session model for cookie-based persistence."""

from __future__ import annotations

from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, utcnow

if TYPE_CHECKING:
    from .learning import LearningSession
    from .user import User


class UserSession(Base):
    """Opaque session persisted for cookie-based auth."""

    __tablename__ = "user_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    learning_session_id: Mapped[str] = mapped_column(
        ForeignKey("learning_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    issued_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    absolute_expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, nullable=False
    )
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship(back_populates="sessions", lazy="joined")
    learning_session: Mapped["LearningSession"] = relationship(
        back_populates="session", lazy="joined"
    )


__all__ = ["UserSession"]
