import os
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import User
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

SECURE_COOKIE = os.getenv("SECURE_COOKIE", "false").lower() == "true"


class AuthRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=SECURE_COOKIE,
        max_age=86400,
    )


@router.post("/signup", status_code=201, response_model=UserResponse)
async def signup(body: AuthRequest, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(email=body.email, hashed_password=hash_password(body.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": user.id})
    _set_auth_cookie(response, token)
    return UserResponse(id=user.id, email=user.email)


@router.post("/signin", response_model=UserResponse)
async def signin(body: AuthRequest, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.id})
    _set_auth_cookie(response, token)
    return UserResponse(id=user.id, email=user.email)


@router.post("/signout")
async def signout(response: Response):
    response.delete_cookie(
        "access_token",
        httponly=True,
        samesite="lax",
        secure=SECURE_COOKIE,
    )
    return {"message": "Signed out"}


@router.get("/me", response_model=UserResponse)
async def me(user: User = Depends(get_current_user)):
    return UserResponse(id=user.id, email=user.email)
