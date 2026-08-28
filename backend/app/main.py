import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, SessionLocal
from . import models
from .routers import events, members, contact
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="INTELLIQ API", version="1.0")

# Configure CORS explicitly for GoDaddy custom domain & Vercel
raw_origins = os.getenv("CORS_ORIGINS", "*")
parsed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

# Include live production domains explicitly
explicit_origins = [
    "https://www.intelliq.co.in",
    "https://intelliq.co.in",
    "https://intelliq-tan.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
]

for o in parsed_origins:
    if o not in explicit_origins and o != "*":
        explicit_origins.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if raw_origins == "*" else explicit_origins,
    allow_credentials=False,  # Set false so wildcard or multi-domain CORS works seamlessly
    allow_methods=["*"],
    allow_headers=["*"],
)

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
                models.Member(name="Veera Muthu Prakash", role="President", linkedin="https://linkedin.com/in/veera-muthu-prakash-swaminathan-a15a4b291"),
                models.Member(name="Josuva", role="Tech Lead", linkedin="https://linkedin.com/in/josuva-anand-271427291"),
                models.Member(name="Balamurugan", role="Chief Editor", linkedin="https://linkedin.com/in/balamurugan-c-5507b82a3"),
                models.Member(name="Abishek", role="Secretary", linkedin="https://linkedin.com/in/abishekmurugesan14"),
            ])
        db.commit()
    finally:
        db.close()

@app.get("/")
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "INTELLIQ API", "version": "1.0"}

app.include_router(events.router)
app.include_router(members.router)
app.include_router(contact.router)