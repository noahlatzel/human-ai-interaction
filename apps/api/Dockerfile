FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_PROJECT_ENVIRONMENT=.venv \
    UV_PYTHON_PREFERENCE=system \
    HAII_ROOT_PATH=/haii/api \
    HAII_API_HOST=0.0.0.0 \
    HAII_API_PORT=8000

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

ENV PATH="/app/.venv/bin:${PATH}"

EXPOSE 8000

CMD ["sh", "-c", "uv run uvicorn app:app --host ${HAII_API_HOST:-0.0.0.0} --port ${HAII_API_PORT:-8000} --proxy-headers --forwarded-allow-ips=* --root-path ${HAII_ROOT_PATH:-}"]
