from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth_utils import authenticate_user, create_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(body: LoginRequest):
    user = authenticate_user(body.username, body.password)
    if not user:
        raise HTTPException(status_code=401, detail="Username atau password salah")
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer", "username": user["username"]}
