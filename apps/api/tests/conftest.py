"""Pytest configuration."""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Iterator

import pytest
from fastapi.testclient import TestClient

from app import create_app
from app.config import reset_settings_cache

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


@pytest.fixture()
def client(tmp_path) -> Iterator[TestClient]:
    """Return a TestClient wired to an isolated SQLite database."""
    db_path = tmp_path / "auth.db"
    os.environ["HAII_SQLITE_URL"] = f"sqlite+aiosqlite:///{db_path}"
    os.environ["HAII_JWT_SECRET"] = "test-secret"
    reset_settings_cache()
    application = create_app()
    with TestClient(application) as test_client:
        yield test_client
