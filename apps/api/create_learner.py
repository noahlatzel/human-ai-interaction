import asyncio

from app.config import get_settings
from app.db import create_engine, create_session_factory
from app.services import user_store


async def main():
    settings = get_settings()
    engine = create_engine(settings)
    session_factory = create_session_factory(engine)

    async with session_factory() as session:
        email = "learner@example.com"
        existing = await user_store.get_user_by_email(session, email)
        if existing:
            print(f"User {email} already exists.")
        else:
            await user_store.create_user(
                session,
                settings=settings,
                email=email,
                password="learnerpw",
                role="student",
                first_name="Learner",
                last_name="User",
            )
            await session.commit()
            print(f"Created user {email} with password 'learnerpw'")


if __name__ == "__main__":
    asyncio.run(main())
