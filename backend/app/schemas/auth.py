from __future__ import annotations
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import re

class LoginRequest(BaseModel):
    email: str
    password: str = Field(..., min_length=8)

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError('Invalid email address')
        return v.lower().strip()

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_banned: bool
    created_at: datetime

    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    detail: str
