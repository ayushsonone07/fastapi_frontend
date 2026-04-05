from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    UserResponse,
    MessageResponse,
)
from app.schemas.user import UserCreate
from app.services.auth_service import (
    create_user,
    login_user,
    refresh_access_token,
    logout_user,
    InvalidCredentialsError,
    InvalidTokenError,
    AuthenticationError,
)
from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)) -> User:
    from app.services.auth_service import get_user_by_email
    
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email already registered"
        )
    
    user = create_user(db, user_data.username, user_data.email, user_data.password)
    return user


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    try:
        user, access_token, refresh_token = login_user(db, login_data.email, login_data.password)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    except InvalidCredentialsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.post("/refresh", response_model=TokenResponse)
def refresh(refresh_data: RefreshRequest, db: Session = Depends(get_db)) -> TokenResponse:
    try:
        access_token, new_refresh_token = refresh_access_token(db, refresh_data.refresh_token)
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )


@router.post("/logout", response_model=MessageResponse)
def logout(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> MessageResponse:
    logout_user(db, current_user.id)
    return MessageResponse(detail="Successfully logged out")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)) -> User:
    return current_user