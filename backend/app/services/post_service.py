from sqlalchemy.orm import Session
from app.models.post import Post


def create_post(db: Session, content: str, user_id: int):
    post = Post(content=content, user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_posts(db: Session):
    return db.query(Post).all()