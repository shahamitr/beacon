# Multi-stage Dockerfile for MERN app

# Backend
FROM node:20 AS server
WORKDIR /app/server
COPY server/package.json ./
RUN npm install
COPY server/ .

# Frontend
FROM node:20 AS client
WORKDIR /app/client
COPY client/package.json ./
RUN npm install
COPY client/ .
RUN npm run build || echo "No build script yet"

# Final image
FROM node:20
WORKDIR /app
COPY --from=server /app/server ./server
COPY --from=client /app/client ./client

# Expose ports
EXPOSE 5000 3000

CMD ["sh", "-c", "cd server && npm run dev"]
