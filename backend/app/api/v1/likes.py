from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.like import Like
from app.core.dependencies import get_db

router = APIRouter()


@router.post("/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    like = Like(user_id=1, post_id=post_id)

    db.add(like)
    db.commit()

    return {"message": "liked"}