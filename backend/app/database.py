from prisma import Prisma
from typing import AsyncGenerator

async def get_db() -> AsyncGenerator[Prisma, None]:
    db = Prisma()
    await db.connect()
    try:
        yield db
    finally:
        await db.disconnect()