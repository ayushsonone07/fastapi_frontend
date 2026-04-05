from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User

router = APIRouter()


@router.post("/comments")
def create_comment(
    data: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    comment = Comment(
        content=data.content,
        post_id=data.post_id,
        user_id=current_user.id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment