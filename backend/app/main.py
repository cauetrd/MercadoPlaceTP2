from fastapi import FastAPI
from contextlib import asynccontextmanager
from .database import get_db
from .routes import users

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(
    title="Backend Projeto TP2",
    description="Backend for the TP2 project",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Backend em funcionamento!"}