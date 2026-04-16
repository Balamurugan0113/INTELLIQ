import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import Depends, HTTPException, status

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./intelliq.db")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def admin_required(current_user = Depends(lambda: None)):  # replace lambda with your real dependency
    """
    FastAPI dependency that ensures current_user is admin.
    Returns the current_user if allowed, otherwise raises 403.
    """
    # Example shape - adjust fields to match your user object
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    # suppose user has attribute `is_admin`
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user
