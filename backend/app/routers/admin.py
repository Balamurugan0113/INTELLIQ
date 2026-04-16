# backend/app/routes/admin.py
import os
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..database import SessionLocal, get_db
from .. import models, schemas
from ..models import Contact

router = APIRouter()

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "changeme")

def check_admin_token(x_token: str = Header(None)):
    if x_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@router.get("/api/admin/contacts", response_model=list[schemas.ContactOut])
def list_contacts(limit: int = 100, db: Session = Depends(get_db), authorized: bool = Depends(check_admin_token)):
    qs = db.query(Contact).order_by(Contact.created_at.desc()).limit(limit).all()
    return qs
