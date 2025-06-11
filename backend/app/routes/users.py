from prisma import Prisma
from ..models.users import UserCreate, UserUpdate, UserRead
from typing import List, Optional
from ..database import get_db
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserRead)
async def create_user(
    user: UserCreate,
    db: Prisma = Depends(get_db)
):
    return await db.user.create(data={
        "username": user.username,
        "email": user.email,
        "password": user.password,
    })

@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    user: UserUpdate,
    db: Prisma = Depends(get_db)
):
    existing_user = await db.user.find_unique(where={"id": user_id})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    data = {
        "username": user.username,
        "email": user.email,
    }
    if user.password:
        data["password"] = user.password

    return await db.user.update(
        where={"id": user_id},
        data={
            'username': data['username'],
            'email': data['email'],
            'password': data.get('password', existing_user.password),
        }
    )




