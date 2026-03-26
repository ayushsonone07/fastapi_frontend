import os
print("DATABASE_URL:", os.getenv("DATABASE_URL"))  # Add this line
from app.main import app
