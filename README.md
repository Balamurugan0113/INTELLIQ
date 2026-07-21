<div align="center">
  <img src="frontend/public/Logo.png" alt="INTELLIQ Logo" width="180"/>

  # 🧠 INTELLIQ

  **🚀 Association of Artificial Intelligence & Data Science**  
  *🎓 INFO Institute of Engineering, Coimbatore*

  <h3><em>💡 Innovation Through Unity · 🔨 Learn by Building.</em></h3>

  <p>
    <a href="#-about"><strong>📖 About</strong></a> ·
    <a href="#-features"><strong>✨ Features</strong></a> ·
    <a href="#%EF%B8%8F-tech-stack"><strong>🛠️ Tech Stack</strong></a> ·
    <a href="#-getting-started"><strong>🚀 Get Started</strong></a> ·
    <a href="#-api"><strong>🌐 API</strong></a> ·
    <a href="#-deployment"><strong>🐳 Deploy</strong></a>
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

> [!IMPORTANT]
> 🎯 **INTELLIQ** is the official AI & Data Science student association at INFO Institute of Engineering.
> We foster innovation through hands-on workshops, hackathons, research meetups, and community projects.
> **Our culture:** Open, collaborative, mentor-driven. **Our motto:** *Learn by building.*

---

## ✨ Features

| 🎬 | **Hero Section** | Full-screen cinematic video + GSAP animations + rotating taglines |
|:--:|:--|:--|
| 📅 | **Events** | Dynamic cards with 3D tilt effects + category filters |
| 👥 | **Members** | 33+ member grid with neon-glow names + detail modals |
| 📖 | **About** | Mission statement + animated stats counters |
| 🤝 | **Collaborators** | Scrolling logo marquee of partner orgs |
| 📬 | **Contact** | Form + email notifications + Google Maps embed |
| 💬 | **Chatbot** | AI assistant with persistent conversation history |
| 💳 | **Donations** | UPI QR code modal with copy & download |
| 🎵 | **BG Music** | Ambient audio player with volume controls |
| 🌀 | **Fluid Cursor** | Metaball water trail that shifts color per section |
| 🎲 | **3D Hero** | Three.js parallax scene with pointer tracking |
| 📱 | **Responsive** | Mobile-first · Keyboard accessible · `prefers-reduced-motion` |

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Category | Technologies |
|----------|:------------:|
| **⚛️ Core** | React 18 · Vite 5 |
| **🎭 3D & Animation** | Three.js · GSAP · OGL |
| **🗺️ Maps** | Leaflet · react-leaflet |
| **🎨 UI** | MUI · react-icons · react-player |
| **📦 Build** | Vite · @vitejs/plugin-react |

### ⚙️ Backend

| Category | Technologies |
|----------|:------------:|
| **🚀 Framework** | FastAPI · Uvicorn |
| **🗄️ Database** | PostgreSQL 16 · SQLAlchemy · psycopg2 |
| **✅ Validation** | Pydantic |
| **🔐 Auth** | Bearer token (admin) |

### 🏗️ Infrastructure

| Category | Tools |
|----------|:-----:|
| **🐳 Containerization** | Docker Compose |
| **🌩️ Edge Worker** | Cloudflare Workers |
| **☁️ Deploy Targets** | Render · Railway · Fly.io · AWS ECS |

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.12
- **PostgreSQL** (or SQLite for local)
- **Docker** (optional, for containerized setup)

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173 🎉
```

### 🖥️ Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Linux/macOS
# .venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp ../.env.example ../.env       # edit as needed
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# API docs → http://localhost:8000/docs 📖
```

### 🐳 Docker (Full Stack)

```bash
docker-compose up --build
```

| Service | Port | URL |
|:--------|:----:|:---:|
| 🗄️ PostgreSQL | `5432` | — |
| ⚙️ Backend | `8000` | http://localhost:8000 |
| 🎨 Frontend | `5173` | http://localhost:5173 |

---

## 🌐 API Endpoints

| Method | Endpoint | Description | 🔐 Auth |
|:------:|:---------|:------------|:-------:|
| `GET` | `/api/health` | Health check | — |
| `GET` | `/api/events` | List events | — |
| `POST` | `/api/events` | Create event | Admin |
| `GET` | `/api/events/{id}` | Get event | — |
| `PUT` | `/api/events/{id}` | Update event | Admin |
| `DELETE` | `/api/events/{id}` | Delete event | Admin |
| `GET` | `/api/members` | List members | — |
| `POST` | `/api/members` | Add member | Admin |
| `GET` | `/api/members/{id}` | Get member | — |
| `PUT` | `/api/members/{id}` | Update member | Admin |
| `DELETE` | `/api/members/{id}` | Delete member | Admin |
| `POST` | `/api/contact/` | Submit contact | — |
| `GET` | `/api/messages` | List messages | Admin |
| `DELETE` | `/api/messages/{id}` | Delete message | Admin |
| `GET` | `/api/messages/chat/logs` | Chat logs | Admin |
| `GET` | `/api/admin/contacts` | Contact submissions | Admin |

> **🔑 Admin Auth:** Bearer token via `Authorization: Bearer <ADMIN_TOKEN>`

---

## 📁 Project Structure

```
intelliq/
├── backend/                     # ⚙️ FastAPI server
│   ├── app/
│   │   ├── main.py             # 🚀 App entry, CORS, routers
│   │   ├── database.py         # 🗄️ SQLAlchemy engine
│   │   ├── models.py           # 📦 Event, Member, Message, Contact
│   │   ├── schemas.py          # ✅ Pydantic models
│   │   ├── deps.py             # 🔐 Admin auth dependency
│   │   ├── email_utils.py      # 📧 SMTP utility
│   │   └── routers/            # 📍 events, members, messages, etc.
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                    # 🎨 React + Vite SPA
│   ├── public/
│   │   ├── avatars/            # 🖼️ 33 member photos
│   │   ├── logos/              # 🏷️ 6 collaborator logos
│   │   ├── payments/           # 💳 UPI QR code
│   │   └── hero-bg.mp4         # 🎬 Background video
│   └── src/
│       ├── components/         # 🧩 18 React components
│       ├── lib/three/          # 🎭 Three.js scenes
│       ├── styles/             # 🎨 CSS
│       └── App.jsx             # 🏠 Root component
├── src/index.js                 # 🌩️ Cloudflare Worker
├── docker-compose.yml           # 🐳 3-service orchestration
├── wrangler.toml                # 🌩️ Worker config
├── render.yaml                  # ☁️ Render blueprint
└── .env.example                 # 🔑 Environment template
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|:---------|:--------|:------------|
| `POSTGRES_USER` | `intelliq` | 🗄️ Database user |
| `POSTGRES_PASSWORD` | `supersecret` | 🔑 Database password |
| `POSTGRES_DB` | `intelliq` | 🗄️ Database name |
| `POSTGRES_PORT` | `5432` | 🔌 Database port |
| `DATABASE_URL` | *(composite)* | 🔗 SQLAlchemy DSN |
| `VITE_API_URL` | `http://localhost:8000` | 🔗 Backend URL for frontend |
| `ADMIN_TOKEN` | — | 🔐 Admin bearer token |
| `SMTP_*` | — | 📧 Email configuration |

---

## 🐳 Deployment

### 🐳 Docker

```bash
docker-compose up --build -d
```

### 🌩️ Cloudflare Worker

```bash
npx wrangler deploy
```

### ☁️ Render (Recommended — Free Tier)

This repo includes a [`render.yaml`](render.yaml) blueprint for **one-click deployment** on [Render](https://render.com).

**📦 What you get on the free tier:**

| Service | Plan | Notes |
|:--------|:----|:------|
| 🗄️ PostgreSQL | Free | 90-day trial, then $7/mo |
| ⚙️ Backend API | Free | Sleeps after 15 min idle |
| 🎨 Frontend | Free | Always awake 🚀 |

**📋 Deploy steps:**

| Step | Action |
|:---:|:-------|
| 1 | Go to **[dashboard.render.com](https://dashboard.render.com)** |
| 2 | Click **New → Blueprint** |
| 3 | Select your `Balamurugan0113/INTELLIQ` repo |
| 4 | Render reads `render.yaml` → creates 3 services |
| 5 | Set `ADMIN_TOKEN` when prompted |
| 6 | Click **Apply** ⏳ ~5 min |
| 7 | 🎉 Visit `https://intelliq.onrender.com` |

> **🔐 After deploy:** Set `ADMIN_TOKEN` in Dashboard → intelliq-api → Environment

### 📦 Manual

```bash
# Build frontend
cd frontend && npm run build

# Serve frontend/dist/ via Vercel, Netlify, Cloudflare Pages, etc.
# Deploy backend to Render, Railway, Fly.io, or AWS ECS
# Set environment variables on your platform
```

---

## 🤝 Contributing

> Pull requests are welcome! 🎉

| Step | Action |
|:---:|:-------|
| 1 | 🍴 Fork the repo |
| 2 | 🌿 Create branch: `git checkout -b feature/awesome` |
| 3 | 💾 Commit: `git commit -m 'Add awesome feature'` |
| 4 | 📤 Push: `git push origin feature/awesome` |
| 5 | 🔁 Open a Pull Request |

---

## 📄 License

Maintained by the **🧠 INTELLIQ Association** — AI & Data Science · INFO Institute of Engineering, Coimbatore.

---

<div align="center">
  <sub>Built with ❤️ by the INTELLIQ team</sub>
  <br/>
  <sub>🧠 AI & Data Science Association · 🎓 INFO Institute of Engineering</sub>
</div>
