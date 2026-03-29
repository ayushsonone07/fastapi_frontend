from fastapi import FastAPI
from app.api.v1 import auth, users, posts, comments, likes
from app.db.base import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Social Media API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",                    # Vite dev server
    "https://social-frontend-eta.vercel.app/",         # your deployed frontend
    "https://vm-p1nt2yf09m2pn6wjzagnr8.vusercontent.net/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(posts.router, prefix="/api/v1")
app.include_router(comments.router, prefix="/api/v1")
app.include_router(likes.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "API is running"}
