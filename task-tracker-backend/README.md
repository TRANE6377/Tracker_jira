# Task Tracker Backend

Backend API for a simple task tracker:
- Node.js + Express
- PostgreSQL
- JWT authentication
- CRUD tasks
- Comments for tasks

## Quick start

1) Start Postgres

```bash
cd task-tracker-backend
docker compose up -d
```

2) Install deps

```bash
npm install
```

3) Configure env

```bash
cp .env.example .env
```

4) Run migrations

```bash
npm run migrate
```

5) Start API

```bash
npm run dev
```

## API

- `POST /auth/register`
- `POST /auth/login`
- `GET /me` (auth)

- `POST /tasks` (auth)
- `GET /tasks` (auth)
- `GET /tasks/:taskId` (auth)
- `PATCH /tasks/:taskId` (auth)
- `DELETE /tasks/:taskId` (auth)

- `POST /tasks/:taskId/comments` (auth)
- `GET /tasks/:taskId/comments` (auth)
- `DELETE /tasks/:taskId/comments/:commentId` (auth)

All authenticated routes require:
- `Authorization: Bearer <token>`
