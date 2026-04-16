from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_db, admin_required

router = APIRouter(prefix="/api/messages", tags=["messages"])


# ----------------------------
# ADMIN MESSAGES (existing)
# ----------------------------
@router.get("", response_model=list[schemas.MessageOut], dependencies=[Depends(admin_required)])
def list_messages(db: Session = Depends(get_db)):
    return db.query(models.Message).order_by(models.Message.id.desc()).all()


@router.delete("/{message_id}", dependencies=[Depends(admin_required)])
def delete_message(message_id: int, db: Session = Depends(get_db)):
    rec = db.query(models.Message).get(message_id)
    if not rec:
        raise HTTPException(404, "Message not found")
    db.delete(rec)
    db.commit()
    return {"ok": True}

# ----------------------------
# CHAT LOGS (ADMIN)
# ----------------------------
@router.get("/chat/logs", response_model=list[schemas.ChatLogOut], dependencies=[Depends(admin_required)])
def list_chat_logs(db: Session = Depends(get_db)):
    return db.query(models.ChatLog).order_by(models.ChatLog.id.desc()).limit(200).all()
