from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    lifespan=lifespan,
    docs_url="/rotas",
    redoc_url="/redoc",
    openapi_url="/openapi",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Backend em funcionamento!"}