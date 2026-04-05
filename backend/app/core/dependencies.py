from app.db.session import SessionLocal
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.security import decode_token
from app.services.auth_service import get_user_by_id

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(authorization: str = None, db: session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail = "no authorization header")

    try:
        token = authorization.replace("Bearer ", "")
        user_id = decode_token(token)

        if user_id is None:
            raise HTTPException(status_code=401, detail = "Invalid Token")

        user = get_user_by_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=401, detail = "User not found!")

        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail = str(e))
