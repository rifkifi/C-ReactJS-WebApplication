# CLI Client

Small Go-based HTTP CLI for exercising the Backend API. Supports GET/POST/PUT/PATCH/DELETE, JSON bodies (inline or file), Bearer auth, timeouts, and an insecure TLS option for local testing.

## Requirements
- Go 1.25+

## Build (native)
```
cd cli
go build -trimpath -ldflags "-s -w" -o cli-client ./main.go
```
Run:
```
./cli-client -url http://localhost:5198/
```

## Build (Docker)
```
docker build -t cli-client:1 C-ReactJS-WebApplication/cli
```
# Example when using docker compose (service name: backend)
docker compose run --rm cli -url http://backend:5198/
```

## Usage
```
cli -url <URL> [flags]
```
Flags:
- `-X` string               HTTP method (default `GET`)
- `-url` string             Request URL (required)
- `-auth` string            Bearer token to send as `Authorization: Bearer <token>`
- `-d` string               Inline JSON body (e.g., `'{"name":"foo"}'`)
- `-data-file` string       Path to JSON file to use as request body
- `-H-Content-Type` string  Content-Type header (default `application/json`)
- `-k`                      Allow insecure TLS (self-signed certs)
- `-t` duration             Request timeout (e.g., `5s`, `30s`; default `10s`)

## Examples
- Root health (should return `{ "message": "The api is running" }`):
```
cli -url http://backend:5198/
```

- Public endpoint (restaurants list):
```
cli -url http://backend:5198/api/restaurants
```

- Login to get a token:
```
cli -X POST -url http://backend:5198/api/auth/login -d '{"Username":"user","Password":"pass"}'
```
Copy `access_token` from the response.

- Authenticated request (current user):
```
cli -url http://backend:5198/api/users/data -auth <ACCESS_TOKEN>
```