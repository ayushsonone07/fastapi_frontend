from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from app.core.dependencies import get_db

router = APIRouter()


@router.post("/comments")
def create_comment(data: CommentCreate, db: Session = Depends(get_db)):
    comment = Comment(
        content=data.content,
        post_id=data.post_id,
        user_id=1
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment