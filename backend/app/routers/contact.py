# backend/app/routers/contact.py
import os
import smtplib
from email.message import EmailMessage
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models

router = APIRouter(prefix="/api/contact", tags=["contact"])

# Pydantic schema for incoming contact requests
class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str

# dependency to get DB session (same pattern as other routers)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactIn, db: Session = Depends(get_db)):
    """
    Save contact to DB and optionally send a notification email if SMTP env vars are provided.
    """
    # persist to DB
    contact = models.Contact(
        name=payload.name.strip(),
        email=payload.email.strip(),
        message=payload.message.strip()
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)

    # Optional email notification
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT") or 0)
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASS = os.getenv("SMTP_PASS")
    FROM_EMAIL = os.getenv("FROM_EMAIL") or SMTP_USER
    NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL") or FROM_EMAIL

    if SMTP_HOST and SMTP_PORT and SMTP_USER and SMTP_PASS and NOTIFY_EMAIL:
        try:
            msg = EmailMessage()
            msg["Subject"] = f"[INTELLIQ] New contact from {contact.name}"
            msg["From"] = FROM_EMAIL
            msg["To"] = NOTIFY_EMAIL
            body = f"Name: {contact.name}\nEmail: {contact.email}\n\nMessage:\n{contact.message}\n\nID: {contact.id}"
            msg.set_content(body)

            if SMTP_PORT == 465:
                server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10)
            else:
                server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
                server.ehlo()
                if os.getenv("SMTP_STARTTLS", "true").lower() in ("1","true","yes"):
                    server.starttls()
                    server.ehlo()

            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
            server.quit()
        except Exception as e:
            # don't fail the request; log to stdout (or use your logger)
            print("[contact] email send failed:", e)

    return {"ok": True, "id": contact.id}