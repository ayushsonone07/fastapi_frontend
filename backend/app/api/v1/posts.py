from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.post import PostCreate
from app.services.post_service import create_post, get_posts
from app.core.dependencies import get_db

router = APIRouter()


@router.post("/posts")
def new_post(post: PostCreate, db: Session = Depends(get_db)):
    return create_post(db, post.content, 1)


@router.get("/posts")
def list_posts(db: Session = Depends(get_db)):
    return get_posts(db)