import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

env_path = os.path.join(backend_dir, ".env")
from dotenv import load_dotenv
load_dotenv(env_path)

from app.main import app
from mangum import Mangum

handler = Mangum(app)  # ← THIS is what Vercel calls