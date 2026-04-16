# backend/app/email_utils.py
import os
import smtplib
from email.message import EmailMessage

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL") or SMTP_USER

def send_contact_email(name: str, sender_email: str, message: str):
    if not (SMTP_USER and SMTP_PASS):
        # Logging or silently return if SMTP not configured
        print("SMTP not configured; skipping sending email")
        return

    msg = EmailMessage()
    msg["Subject"] = f"[INTELLIQ] New contact from {name}"
    msg["From"] = FROM_EMAIL
    msg["To"] = SMTP_USER  # send to club mailbox
    body = f"Name: {name}\nEmail: {sender_email}\n\nMessage:\n{message}"
    msg.set_content(body)

    # Use SSL (Gmail typically uses 465)
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.login(SMTP_USER, SMTP_PASS)
        smtp.send_message(msg)
