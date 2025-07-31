#!/bin/bash
set -e

# Build and start all services

echo "[1/4] Installing backend dependencies..."
cd server && npm install && cd ..

echo "[2/4] Installing frontend dependencies..."
cd client && npm install && cd ..

echo "[3/4] Starting Docker Compose (MongoDB, backend, frontend)..."
docker compose up --build
