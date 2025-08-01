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


## Local Development Setup

Follow these steps to set up Beacon for local development:

### 1. Clone the repository
```bash
git clone https://github.com/shahamitr/beacon.git
cd beacon/beacon
```


### 2. Run the install script (choose mode)
```bash
# Development mode (hot-reload, ports 3000/5000)
./install.sh

# Production mode (nginx, frontend on port 80, backend on port 5000)
./install.sh prod
```
This script will:
- Install backend and frontend dependencies
- Start Redis (via Docker)
- Start MongoDB, backend, and frontend using the selected Docker Compose file
- Optionally seed demo data
- Print instructions to start the scan worker

### 3. Start the scan worker (in a separate terminal)
```bash
node server/worker/scanWorker.mjs
```


### 4. Access the application
- In development mode:
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:5000/api
- In production mode:
  - Frontend: http://localhost:80
  - Backend API: http://localhost:5000/api

### 5. Development workflow
- Make code changes in `client/` (React frontend) or `server/` (Express backend)
- Restart affected services if needed (use Docker Compose)
- Use the scan worker for async accessibility scans


### 6. Stopping services
To stop all running containers (dev or prod):
```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.prod.yml down
```

---

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
