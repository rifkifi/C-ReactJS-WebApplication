# C-ReactJS-WebApplication 

This repo contains full‑stack app running in docker multi-container:
- Backend: ASP.NET Core 9 Web API + EF Core (PostgreSQL)
- Frontend: React + Vite (served by Nginx in production image)
- Database: PostgreSQL 16
- CLI: HTTP client for quick API calls using Golang

## Prerequisites
- Docker Desktop (or Docker Engine) and Docker Compose v2
- Internet access to pull images the first time

## Services & Ports
- API: `http://localhost:5198`
- Frontend: `http://localhost:3001`
- PostgreSQL: `localhost:5432` (username `root`, password in compose)

## 0) Clone the repository
- Using http : 
```
git clone https://github.com/rifkifi/C-ReactJS-WebApplication.git
```
- Using ssh : 
```
git clone git@github.com:rifkifi/C-ReactJS-WebApplication.git
```
## 1) Build and Run the Applications
### Build and run using docker compose
From the repo root:

```
docker compose up -d --build
```

Compose will:
- Start `pg` 
- Build and start `backend` 
- Build and start `frontend`
- Build the `cli` 

## 2) Verify
- Check containers: `docker compose ps`
- Follow logs: `docker compose logs -f pg backend`
- Check if the app is running:
  - backend: `http://localhost:5198/` → `{ "message": "The api is running" }`
  - frontend: `http://localhost:3001` 

## 3) Login Credentials for Admin
- Username: `admin`
- Password: `121212`

## 4) Running CLI program
```
docker compose run --rm cli -X METHOD -url URL [-auth TOKEN] [-d 'JSON' | -data-file /app/file.json] [-H-Content-Type TYPE] [-t 10s] [-k]
```

-X: HTTP method (GET, POST, PUT, PATCH, DELETE). Default GET.
-url: Full URL (inside Compose use http://backend:5198/...).
-auth: Bearer token (sends Authorization: Bearer <token>).
-d: Inline JSON body (e.g., '{"Name":"foo"}').
-data-file: Path to JSON body file (inside container).
-H-Content-Type: Content-Type header (default application/json).
-t: Request timeout (e.g., 5s, 30s). Default 10s.
-k: Allow insecure TLS (only for https with self-signed).

## 5) Default Data
On first start the backend applies migrations and inserts:
- Restaurant Types (Cafe, Chinese, Indonesian, Italian, Japanese, Mexican, Seafood, Thai, Vegan)
- Menu Categories (Appetizer, Dessert, Drink, Main Course, Side Dish, Special)
- Admin user 
- A sample Restaurant and Menu item

## 6) Stopping/Removing
- Stop containers (keep state): `docker compose stop`
- Stop and remove containers/network: `docker compose down`
- Remove everything including volumes (data loss): `docker compose down -v`

## 7) Useful Commands
- Rebuild one service: `docker compose build backend` (or `frontend`, `cli`)
- Tail logs for a service: `docker compose logs -f backend`
- Exec into Postgres: `docker compose exec pg psql -U root -d restaurant_db`
