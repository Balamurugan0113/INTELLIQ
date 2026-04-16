import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, SessionLocal
from . import models
from .routers import events, members, contact
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="INTELLIQ API", version="1.0")

DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql://intelliq:supersecret@db:5432/intelliq_db"

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Create tables & seed placeholders if empty
@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
      if not db.query(models.Event).first():
          db.add_all([
              models.Event(title="Intro to Transformers", date="2025-12-12", type="Workshop", description="Hands-on with attention and fine-tuning.", link="#"),
              models.Event(title="Data Viz Night", date="2026-01-08", type="Talk", description="From raw to remarkable dashboards.", link="#"),
              models.Event(title="INTELLIQ Hack 2.0", date="2026-02-21", type="Hackathon", description="Build AI that matters.", link="#"),
          ])
      if not db.query(models.Member).first():
          db.add_all([
              models.Member(name="Veera Muthu Prakash", role="President", linkedin="linkedin.com/in/veera-muthu-prakash-swaminathan-a15a4b291"),
              models.Member(name="Josuva", role="Tech Lead", linkedin="linkedin.com/in/josuva-anand-271427291"),
              models.Member(name="Balamurugan", role="Chief Editor", linkedin="linkedin.com/in/balamurugan-c-5507b82a3"),
              models.Member(name="Abishek", role="Secretary", linkedin="linkedin.com/in/abishekmurugesan14"),
          ])
      db.commit()
    finally:
      db.close()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.on_event("shutdown")
async def shutdown():
    pool = getattr(app.state, "db", None)
    if pool:
        await pool.close()

app.include_router(events.router)
app.include_router(members.router)
app.include_router(contact.router)