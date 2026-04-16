from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..deps import admin_required

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("", response_model=list[schemas.EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(models.Event).order_by(models.Event.date.asc()).all()


@router.post("", response_model=schemas.EventOut)
def create_event(
    evt: schemas.EventIn,
    _: bool = Depends(admin_required),
    db: Session = Depends(get_db),
):
    e = models.Event(**evt.model_dump())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    e = db.query(models.Event).get(event_id)
    if not e:
        raise HTTPException(404, "Event not found")
    return e


@router.put("/{event_id}", response_model=schemas.EventOut)
def update_event(
    event_id: int,
    patch: schemas.EventUpdate,
    _: bool = Depends(admin_required),
    db: Session = Depends(get_db),
):
    e = db.query(models.Event).get(event_id)
    if not e:
        raise HTTPException(404, "Event not found")

    for k, v in patch.model_dump(exclude_unset=True).items():
        setattr(e, k, v)

    db.commit()
    db.refresh(e)
    return e


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    _: bool = Depends(admin_required),
    db: Session = Depends(get_db),
):
    e = db.query(models.Event).get(event_id)
    if not e:
        raise HTTPException(404, "Event not found")

    db.delete(e)
    db.commit()
    return {"ok": True}
