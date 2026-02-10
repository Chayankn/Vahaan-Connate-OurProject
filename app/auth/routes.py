from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.auth.jwt import create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # TEMP USERS (replace with DB later)
    if form_data.username == "admin" and form_data.password == "admin":
        token = create_token("admin", "admin")
    elif form_data.username == "user" and form_data.password == "user":
        token = create_token("user", "user")
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": token,
        "token_type": "bearer"
    }