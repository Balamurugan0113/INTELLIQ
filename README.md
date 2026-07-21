<div align="center">
  <img src="frontend/public/Logo.png" alt="INTELLIQ Logo" width="180"/>

  # INTELLIQ

  **Association of Artificial Intelligence & Data Science**  
  *INFO Institute of Engineering, Coimbatore*

  <h3><em>Innovation Through Unity &mdash; Learn by Building.</em></h3>

  <p>
    <a href="#-about"><strong>About</strong></a> ·
    <a href="#-features"><strong>Features</strong></a> ·
    <a href="#-tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#-getting-started"><strong>Get Started</strong></a> ·
    <a href="#-api"><strong>API</strong></a> ·
    <a href="#-deployment"><strong>Deploy</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React"/>
    <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white" alt="FastAPI"/>
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
    <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker"/>
    <img src="https://img.shields.io/badge/Three.js-0.160-000000?logo=threedotjs&logoColor=white" alt="Three.js"/>
    <img src="https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white" alt="GSAP"/>
  </p>

  <p>
    <img src="https://img.shields.io/github/license/Balamurugan0113/INTELLIQ?color=blue" alt="License"/>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome"/>
  </p>
</div>

---

<!-- Add a screenshot or screen recording of the website here -->
<!-- Example: ![INTELLIQ Website Screenshot](screenshot.png) -->

---

## 🌟 About

**INTELLIQ** is the official **Association of Artificial Intelligence & Data Science** at **INFO Institute of Engineering**, run entirely by students. We foster innovation through hands-on workshops, hackathons, research meetups, speaker sessions, and community-driven projects in AI & Data Science.

> **Our Culture:** Open, collaborative, mentor-driven.  
> **Our Motto:** *Learn by building.*  
> **Focus Areas:** Machine Learning · Computer Vision · NLP · Data Engineering · MLOps

---

## ✨ Features

<div>
  <table>
    <tr>
      <td align="center"><strong>🎬 Hero</strong><br/>Video BG + GSAP titles + rotating taglines</td>
      <td align="center"><strong>📅 Events</strong><br/>Dynamic cards with 3D tilt + filter chips</td>
      <td align="center"><strong>👥 Members</strong><br/>Grid with neon-glow names + detail modals</td>
    </tr>
    <tr>
      <td align="center"><strong>📖 About</strong><br/>Mission + animated stats counters</td>
      <td align="center"><strong>🤝 Collaborators</strong><br/>Scrolling logo marquee</td>
      <td align="center"><strong>📬 Contact</strong><br/>Form + map + social chips</td>
    </tr>
    <tr>
      <td align="center"><strong>💬 Chatbot</strong><br/>AI assistant with persistent history</td>
      <td align="center"><strong>💳 Donations</strong><br/>UPI QR modal with copy/download</td>
      <td align="center"><strong>🎵 BG Music</strong><br/>Ambient audio with player controls</td>
    </tr>
    <tr>
      <td align="center"><strong>🌀 Fluid Cursor</strong><br/>Metaball water trail</td>
      <td align="center"><strong>🎲 3D Hero</strong><br/>Three.js parallax scene</td>
      <td align="center"><strong>📱 Responsive</strong><br/>Mobile-first + a11y + reduced motion</td>
    </tr>
  </table>
</div>

---

## 🛠️ Tech Stack

### Frontend

| Category | Technologies |
|----------|-------------|
| **Core** | React 18 · Vite 5 |
| **3D & Animation** | Three.js · GSAP · OGL |
| **Maps** | Leaflet · react-leaflet |
| **UI** | MUI · react-icons · react-player |
| **Build** | Vite · @vitejs/plugin-react |

### Backend

| Category | Technologies |
|----------|-------------|
| **Framework** | FastAPI · Uvicorn |
| **Database** | PostgreSQL 16 · SQLAlchemy · psycopg2 |
| **Validation** | Pydantic |
| **Auth** | Bearer token |

### Infrastructure

| Category | Tools |
|----------|-------|
| **Containerization** | Docker Compose |
| **Edge Worker** | Cloudflare Workers |
| **Target Platforms** | Render · Railway · Fly.io · AWS ECS |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.12
- PostgreSQL (or SQLite for local-only backend)
- Docker (optional)

### Frontend

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Linux/macOS
# .venv\Scripts\activate       # Windows
pip install -r requirements.txt
cp ../.env.example ../.env     # edit as needed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# API docs → http://localhost:8000/docs
```

### Docker (Full Stack)

```bash
docker-compose up --build
```

This starts **PostgreSQL** (`:5432`), **Backend** (`:8000`), and **Frontend** (`:5173`).

---

## 🌐 API

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/health` | Health check | — |
| `GET` | `/events` | List events | — |
| `POST` | `/events` | Create event | Admin |
| `GET` | `/events/{id}` | Get event | — |
| `PUT` | `/events/{id}` | Update event | Admin |
| `DELETE` | `/events/{id}` | Delete event | Admin |
| `GET` | `/members` | List members | — |
| `POST` | `/members` | Add member | Admin |
| `GET` | `/members/{id}` | Get member | — |
| `PUT` | `/members/{id}` | Update member | Admin |
| `DELETE` | `/members/{id}` | Delete member | Admin |
| `POST` | `/contact/` | Submit contact | — |
| `GET` | `/messages` | List messages | Admin |
| `DELETE` | `/messages/{id}` | Delete message | Admin |
| `GET` | `/messages/chat/logs` | Chat logs | Admin |
| `GET` | `/admin/contacts` | Contact submissions | Admin |

**Admin Auth:** Bearer token via `Authorization: Bearer <ADMIN_TOKEN>`.

---

## 📁 Project Structure

```
intelliq/
├── backend/                     # FastAPI server
│   ├── app/
│   │   ├── main.py             # App entry, CORS, routers
│   │   ├── database.py         # SQLAlchemy engine
│   │   ├── models.py           # Event, Member, Message, Contact
│   │   ├── schemas.py          # Pydantic models
│   │   ├── deps.py             # Admin auth dependency
│   │   ├── email_utils.py      # SMTP utility
│   │   └── routers/            # events, members, messages, etc.
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                    # React + Vite SPA
│   ├── public/
│   │   ├── avatars/            # 33 member photos
│   │   ├── logos/              # 6 collaborator logos
│   │   ├── payments/           # UPI QR code
│   │   └── hero-bg.mp4         # Background video
│   └── src/
│       ├── components/         # 18 React components
│       ├── lib/three/          # Three.js scenes
│       ├── styles/             # base.css, responsive.css
│       └── App.jsx             # Root component
├── src/index.js                 # Cloudflare Worker
├── docker-compose.yml           # 3-service orchestration
├── wrangler.toml                # Worker config
└── .env.example                 # Environment template
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `intelliq` | Database user |
| `POSTGRES_PASSWORD` | `supersecret` | Database password |
| `POSTGRES_DB` | `intelliq` | Database name |
| `POSTGRES_PORT` | `5432` | Database port |
| `DATABASE_URL` | *(composite)* | SQLAlchemy DSN |
| `VITE_API_URL` | `http://localhost:8000` | Backend URL |
| `ADMIN_TOKEN` | — | Admin bearer token |
| `SMTP_*` | — | Email configuration |

---

## 🐳 Deployment

### Docker

```bash
docker-compose up --build -d
```

### Cloudflare Worker

```bash
npx wrangler deploy
```

### Render (Recommended — Free Tier)

This repo includes a [`render.yaml`](render.yaml) blueprint for one-click deployment on [Render](https://render.com).

**What you get on the free tier:**
- ✅ PostgreSQL database (90-day trial, then $7/mo or migrate)
- ✅ FastAPI backend web service (sleeps after 15 min inactivity)
- ✅ React frontend static site (always awake)

**Deploy steps:**

1. Push this repo to GitHub (already done)
2. Go to **[dashboard.render.com](https://dashboard.render.com)** → **New** → **Blueprint**
3. Connect your GitHub account and select the **INTELLIQ** repo
4. Render reads [`render.yaml`](render.yaml) and creates all 3 services automatically
5. When prompted, set the `ADMIN_TOKEN` environment variable (a secure random string)
6. Click **Apply** and wait ~5 minutes for the first deploy
7. Visit your live site at `https://intelliq.onrender.com`

**Set ADMIN_TOKEN after deploy:**
- Go to Dashboard → intelliq-api → Environment → Add `ADMIN_TOKEN` with a secure value
- The backend uses this token for protected endpoints (create events, members, etc.)

### Manual

1. Build frontend: `cd frontend && npm run build`
2. Serve `frontend/dist/` via any static host (Vercel, Netlify, Cloudflare Pages)
3. Deploy backend to Render, Railway, Fly.io, or AWS ECS
4. Set environment variables on your platform

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push (`git push origin feature/awesome`)
5. Open a Pull Request

---

## 📄 License

Maintained by the **INTELLIQ Association** — INFO Institute of Engineering, Coimbatore.

---

<div align="center">
  <sub>Built with ❤️ by the INTELLIQ team</sub>
  <br/>
  <sub>AI & Data Science Association · INFO Institute of Engineering</sub>
</div>
