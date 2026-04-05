from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.models.like import Like

router = APIRouter()


@router.post("/posts/{post_id}/like")
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    existing_like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already liked this post"
        )
    
    like = Like(user_id=current_user.id, post_id=post_id)
    db.add(like)
    db.commit()
    
    return {"message": "liked"}