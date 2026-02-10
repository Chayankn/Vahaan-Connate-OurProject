from datetime import datetime, timedelta
from jose import jwt
from app.config import settings

def create_token(username: str, role: str):
    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=12)
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")