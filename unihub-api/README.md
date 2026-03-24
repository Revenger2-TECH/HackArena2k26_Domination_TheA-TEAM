# UniHub API

Backend API for UniHub Student Campus Dashboard.

## Quick Start

```bash
cd unihub-api
npm install
npm run dev
```

API runs on `http://localhost:5000`

## Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@student.college.edu","password":"password123"}'
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Student login |
| GET | /api/student/profile | Get student profile |
| GET | /api/attendance | Get attendance summary |
| POST | /api/attendance/scan | Mark attendance via QR |
| GET | /api/academic/marks | Get subject marks |
| GET | /api/campus/notices | Get college notices |
| GET | /api/campus/lost-found | Get lost & found items |
| GET | /api/campus/canteen | Get canteen menu |
| GET | /api/campus/library | Get library books |
| POST | /api/faculty/generate-qr | Generate attendance QR |
| GET | /api/health | Health check |

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | rahul@student.college.edu | password123 |
