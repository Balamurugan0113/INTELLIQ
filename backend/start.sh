#!/usr/bin/env bash
set -e
python - <<'PY'
import os, time
from sqlalchemy import create_engine, text
url = os.environ.get("DATABASE_URL")
for _ in range(30):
    try:
        eng = create_engine(url)
        with eng.connect() as c: c.execute(text("SELECT 1"))
        print("DB ready")
        break
    except Exception as e:
        print("Waiting for DB...", e)
        time.sleep(2)
PY

uvicorn app.main:app --host 0.0.0.0 --port 8000
