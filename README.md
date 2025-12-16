# Calendar Events Application

A full-stack calendar application that integrates with Google Calendar, allowing users to view, create, and manage their calendar events.

## 🚀 Quick Start

Get started in minutes with Docker Compose (recommended):

```bash
# 1. Setup environment
cp .env.example .env.docker

# 2. Edit .env with your Google OAuth credentials
nano .env.docker

# 3. Start the application
docker compose up
```

Access the application:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Swagger API Docs**: http://localhost:3000/api-docs

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│  Frontend   │◄────────┤    API      │◄────────┤  PostgreSQL  │
│  (React)    │  JSON   │ (Express)   │  ORM    │              │
└─────────────┘         └─────────────┘         └──────────────┘
       │                       │
       └───────────────────────┘
          Authentication &
          Google Calendar Sync
```

## Features

- ✅ **Google OAuth 2.0 Authentication** - Secure login with Google
- ✅ **Calendar Integration** - Sync events from Google Calendar
- ✅ **Event Management** - Create, view, and manage events
- ✅ **Docker Support** - One-command deployment with Docker Compose
- ✅ **TypeScript** - Type-safe frontend and backend
- ✅ **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Vite
- Axios

### Backend
- Express.js
- TypeScript
- Passport.js (OAuth)
- Prisma ORM
- PostgreSQL

### DevOps
- Docker & Docker Compose
- GitHub CI/CD ready

## 🔐 Security

- Google OAuth 2.0 for authentication
- HTTPS ready
- CORS configured
- Input validation on all endpoints
- Sensitive data in environment variables

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Initiate Google login |
| GET | `/api/auth/google/callback` | OAuth callback |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/events?timeMin=&timeMax=` | Get events |
| POST | `/api/events/refresh` | Sync Google Calendar |
| POST | `/api/events` | Create event |

## 🐳 Docker Services

The application consists of three Docker services:

1. **API** (Port 3000)
   - Express.js backend
   - Hot-reload on code changes
   - Connects to PostgreSQL

2. **Frontend** (Port 5173)
   - React application
   - Hot-reload on code changes
   - Communicates with API

3. **PostgreSQL** (Port 5432)
   - Database server
   - Persistent volume storage
   - Automatically initialized

## 🔧 Development

### Prerequisites
- Node.js 22+
- Docker & Docker Compose (for containerized development)
- PostgreSQL (for local development)

### Local Development Setup

```bash
# Backend
cd api
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

## 🔑 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/calendar_events

# API
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Frontend
VITE_API_URL=http://localhost:3000
```

### Getting Google OAuth Credentials

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 Web Application credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy credentials to `.env`

## 📦 Project Structure

```
calendar-events/
├── api/                 # Backend (Express.js)
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── middlewares/ # Express middleware
│   └── prisma/          # Database schema
├── frontend/            # Frontend (React)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── services/    # API client
├── docker-compose.yml   # Docker orchestration
├── .env.example        # Environment template
└── docs/               # Documentation
```

## 🚀 Deployment

### Docker Compose (Development)
```bash
docker compose up
```

- [Google Calendar API](https://developers.google.com/calendar)

---