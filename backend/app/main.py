import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import init_db
from app.routers.auth_router import router as auth_router
from app.routers.chat_router import router as chat_router
from app.routers.document_router import router as document_router

load_dotenv()

STATIC_DIR = os.getenv("STATIC_DIR", "static")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(document_router, prefix="/api/documents", tags=["documents"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if os.path.isdir(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
