import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import init_db
from app.routers.auth_router import router as auth_router

STATIC_DIR = os.getenv("STATIC_DIR", "static")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if os.path.isdir(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
