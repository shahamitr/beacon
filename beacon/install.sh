#!/bin/bash
set -e

echo "[1/6] Installing backend dependencies..."
cd server && npm install && cd ..

echo "[2/6] Installing frontend dependencies..."
cd client && npm install && cd ..

echo "[3/6] Starting Redis (for scan queue)..."
if ! docker ps | grep -q redis; then
  docker run -d --name redis -p 6379:6379 redis || true
else
  echo "Redis already running."
fi

echo "[4/6] Starting Docker Compose (MongoDB, backend, frontend)..."
MODE=${1:-dev}
if [ "$MODE" = "prod" ]; then
  echo "[INFO] Using production mode (docker-compose.prod.yml)"
  docker compose -f docker-compose.prod.yml up --build -d
else
  echo "[INFO] Using development mode (docker-compose.dev.yml)"
  docker compose -f docker-compose.dev.yml up --build -d
fi

echo "[5/6] Seeding demo data (optional, can skip if not needed)..."
if [ -f server/demo-data.js ]; then
  node server/demo-data.js || true
fi

echo "[6/6] To start the scan worker, run:"
echo "    node server/worker/scanWorker.mjs"
echo "---"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api"
