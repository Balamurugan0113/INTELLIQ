from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db, admin_required

router = APIRouter(prefix="/api/members", tags=["members"])

@router.get("", response_model=list[schemas.MemberOut])
def list_members(db: Session = Depends(get_db)):
    return db.query(models.Member).order_by(models.Member.id.asc()).all()

@router.post("", response_model=schemas.MemberOut, dependencies=[Depends(admin_required)])
def create_member(m: schemas.MemberIn, db: Session = Depends(get_db)):
    rec = models.Member(**m.model_dump())
    db.add(rec); db.commit(); db.refresh(rec)
    return rec

@router.get("/{member_id}", response_model=schemas.MemberOut)
def get_member(member_id: int, db: Session = Depends(get_db)):
    rec = db.query(models.Member).get(member_id)
    if not rec: raise HTTPException(404, "Member not found")
    return rec

@router.put("/{member_id}", response_model=schemas.MemberOut, dependencies=[Depends(admin_required)])
def update_member(member_id: int, patch: schemas.MemberUpdate, db: Session = Depends(get_db)):
    rec = db.query(models.Member).get(member_id)
    if not rec: raise HTTPException(404, "Member not found")
    for k, v in patch.model_dump(exclude_unset=True).items():
        setattr(rec, k, v)
    db.commit(); db.refresh(rec)
    return rec

@router.delete("/{member_id}", dependencies=[Depends(admin_required)])
def delete_member(member_id: int, db: Session = Depends(get_db)):
    rec = db.query(models.Member).get(member_id)
    if not rec: raise HTTPException(404, "Member not found")
    db.delete(rec); db.commit()
    return {"ok": True}
