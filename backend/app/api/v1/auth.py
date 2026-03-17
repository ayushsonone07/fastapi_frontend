from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_access_token
from app.core.dependencies import get_db

router = APIRouter()


@router.post("/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user.username, user.email, user.password)


@router.post("/auth/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = authenticate_user(db, email, password)

    if not user:
        return {"error": "Invalid credentials"}

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token}