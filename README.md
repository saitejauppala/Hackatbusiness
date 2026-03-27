# Endless Path Production Backend

A production-ready NestJS application leveraging Prisma, JWT Auth, Route Optimization (Dijkstra), WebSocket streaming, Data Ingestion logic with automated retries, and a deterministic Multi-Agent Autonomous Decision Engine.

## Requirements
- Docker
- PostgreSQL Database

## Local Development
```bash
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

## Docker Deployment (Production)
The backend uses a multi-stage Docker build to keep image sizes optimized, decoupled, and highly secure.

### 1. Build the Docker Image
```bash
docker build -t endless-path-backend .
```

### 2. Run the Container
You MUST provide the required environment variables (`DATABASE_URL`, `JWT_SECRET`, and `PORT`) mapping your deployed schemas.

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&sslmode=require" \
  -e JWT_SECRET="your-super-secure-production-jwt-key" \
  -e PORT=3000 \
  endless-path-backend
```

## APIs Built
- `GET /health` : Open health check mapping
- `POST /auth/login` : Issue JWTs for validation scopes
- `GET /risk/:routeId` : Evaluate Multi-Agent Risks concurrently
- `POST /optimize` : Dijkstra Pathfinding Route Calculator topological graph
- `POST /decision/execute` : Reroute/Alert Determinations bounding securely
- `WS /` : Realtime Socket.IO Gateway (`risk_update`, `alert`, `route_change`)
