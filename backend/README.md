# Backend API

ASP.NET Core Web API for the C-ReactJS-WebApplication project. Provides authentication and CRUD endpoints for restaurants, menus, categories, and users.

## Tech Stack
- .NET 9 (ASP.NET Core Web API)
- Entity Framework Core 9 (Code-First)
- PostgreSQL (via Npgsql)
- JWT Bearer Authentication
- Swagger/OpenAPI (dev only)

## Prerequisites
- .NET SDK 9.0+
- PostgreSQL 13+
- Optional: EF Core CLI `dotnet-ef` (for running migrations locally)

## Configuration
The API requires a database connection string and JWT settings. Provide them via user secrets or environment variables.

Required settings:
- `ConnectionStrings:Default`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:Key`
- `Jwt:AccessTokenMinutes` (optional, default 60)

## Database
Apply migrations to create/update the database schema.

- Install EF CLI (once): `dotnet tool install --global dotnet-ef`
- From `backend/` run: `dotnet ef database update`

To add a new migration:
```
dotnet ef migrations add <MigrationName>
```

## Run
From this `backend/` directory:
```
dotnet run
```

Default URLs (from `Properties/launchSettings.json`):
- HTTP: `http://localhost:5198`


## API Overview
Base path: `/api`

- Auth
  - `POST /api/auth/register` — create account
  - `POST /api/auth/login` — obtain JWT (`access_token`)
- Users (JWT)
  - `GET /api/users` — list users (admin only)
  - `GET /api/users/data` — current user profile
  - `PUT /api/users/{id}` — update own profile
- Restaurants
  - `GET /api/restaurants` — paged list
  - `GET /api/restaurants/{id}` — details
  - `GET /api/restaurants/owner/{id}` — by owner (JWT)
  - `GET /api/restaurants/type/{id}` — by type
  - `POST /api/restaurants/create` — create (JWT)
  - `PUT /api/restaurants/{id}` — update (JWT, owner)
  - `DELETE /api/restaurants/{id}` — delete (JWT, owner or admin)
- Menus, Menu Categories, Restaurant Types — standard CRUD endpoints

Authentication: send `Authorization: Bearer <token>` header for protected routes.

## Project Structure
- `Program.cs` — app bootstrapping, CORS, auth, Swagger
- `Data/` — `AppDbContext` and EF model configuration
- `Models/` — domain entities
- `Dtos/` — request/response DTOs and wrappers
- `Controllers/` — API endpoints
- `Migrations/` — EF Core migrations


