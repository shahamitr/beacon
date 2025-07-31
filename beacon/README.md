# Beacon Accessibility Scanner

A modern, scalable MERN stack application for automated accessibility scanning, reporting, and analytics.

---

## Features
- User authentication (JWT)
- Website management (add/list)
- Manual scan trigger for any website
- Async scan processing with BullMQ, Redis, Puppeteer, and axe-core
- Raw and structured accessibility results stored in MongoDB
- Dashboard, scan history, and comparison UI (React + Tailwind)
- Modular, production-ready backend and worker

---

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- (Optional) Redis server (for BullMQ job queue)

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/shahamitr/beacon.git
cd beacon/beacon
```

### 2. Install dependencies
```bash
./install.sh
```
This will install backend and frontend dependencies and start MongoDB, backend, and frontend using Docker Compose.

### 3. Start Redis (for job queue)
You can use Docker:
```bash
docker run -d --name redis -p 6379:6379 redis
```
Or install Redis locally.

### 4. Seed demo data (optional)
```bash
node server/demo-data.js
```

### 5. Start the scan worker
```bash
node server/worker/scanWorker.mjs
```

### 6. Access the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## Usage
- Register/login in the web UI
- Add websites to your dashboard
- Trigger scans manually
- View scan results, issues, and compare scans

---

## Development
- Backend: `server/`
- Frontend: `client/`
- Worker: `server/worker/scanWorker.mjs`
- Queue: `server/queue.js`

---

## Security & Best Practices
- All secrets/config via environment variables
- JWT authentication for all API routes
- Async job queue for scalability
- Error handling and logging (Winston)
- Modular code structure

---

## License
MIT
