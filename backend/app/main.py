from fastapi import FastAPI
from app.api.v1 import auth, users, posts, comments, likes
from app.db.base import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Social Media API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://expert-journey-wjx54pvqgjqcxwg-5173.app.github.dev",                    # Vite dev server
    "https://social-frontend-eta.vercel.app",         # your deployed frontend
    "https://social-frontend-ty27.vercel.app",
    "https://supreme-palm-tree-qg64xjv5x7vfwr6-3000.app.github.dev",
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
