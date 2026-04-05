from __future__ import annotations
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.schemas.post import PostCreate
from app.services.post_service import create_post, get_posts
from app.core.dependencies import get_db, get_current_active_user

router = APIRouter()


@router.post("/posts")
def new_post(
    post: PostCreate, 
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return create_post(db, post.content, current_user.id)


@router.get("/posts")
def list_posts(db: Session = Depends(get_db)):
    return get_posts(db)