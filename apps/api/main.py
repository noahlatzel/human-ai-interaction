from __future__ import annotations

import uvicorn

from app.config import get_settings


def main() -> None:
    settings = get_settings()
    uvicorn.run(
        "app:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.reload,
        proxy_headers=True,
        forwarded_allow_ips="*",
        root_path=settings.root_path,
    )


if __name__ == "__main__":
    main()
