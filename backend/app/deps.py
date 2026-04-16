import os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from .database import SessionLocal

bearer_scheme = HTTPBearer(auto_error=False)

# ✅ DB dependency (MISSING BEFORE)
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Admin auth (your existing logic)
def admin_required(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authenticated",
        )

    admin_token = os.getenv("ADMIN_TOKEN")
    if not admin_token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ADMIN_TOKEN is not set in environment",
        )

    if credentials.credentials != admin_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin token",
        )

    return True
