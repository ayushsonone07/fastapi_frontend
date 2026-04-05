from __future__ import annotations
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_user_id_from_token,
)


class AuthenticationError(Exception):
    pass


class InvalidCredentialsError(AuthenticationError):
    pass


class TokenExpiredError(AuthenticationError):
    pass


class InvalidTokenError(AuthenticationError):
    pass


def create_user(db: Session, username: str, email: str, password: str) -> User:
    hashed_pw = hash_password(password)
    user = User(
        username=username,
        email=email,
        password=hashed_pw,
        is_active=True,
        is_banned=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if user is None:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def login_user(db: Session, email: str, password: str) -> tuple[User, str, str]:
    user = authenticate_user(db, email, password)
    if user is None:
        raise InvalidCredentialsError("Invalid email or password")
    
    if not user.is_active:
        raise AuthenticationError("User account is inactive")
    
    if user.is_banned:
        raise AuthenticationError("User account is banned")
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    user.refresh_token = refresh_token
    db.commit()
    
    return user, access_token, refresh_token


def refresh_access_token(db: Session, refresh_token: str) -> tuple[str, str]:
    user_id = get_user_id_from_token(refresh_token)
    if user_id is None:
        raise InvalidTokenError("Invalid refresh token")
    
    user = get_user_by_id(db, user_id)
    if user is None:
        raise InvalidTokenError("User not found")
    
    if user.refresh_token != refresh_token:
        raise InvalidTokenError("Refresh token has been revoked")
    
    new_access_token = create_access_token({"sub": str(user.id)})
    new_refresh_token = create_refresh_token({"sub": str(user.id)})
    
    user.refresh_token = new_refresh_token
    db.commit()
    
    return new_access_token, new_refresh_token


def logout_user(db: Session, user_id: int) -> None:
    user = get_user_by_id(db, user_id)
    if user is not None:
        user.refresh_token = None
        db.commit()