from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.user_service import get_user
from app.core.dependencies import get_db

router = APIRouter()


@router.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    return get_user(db, user_id)