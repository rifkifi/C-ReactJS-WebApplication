## Build stage
FROM golang:1.25-alpine AS build
WORKDIR /src

# Copy module files and download deps (none currently, but keeps cache sane)
COPY go.mod ./
RUN go mod download

# Build the binary (static)
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o /out/cli ./main.go

## Runtime stage
FROM alpine:3.20 AS final
RUN adduser -D -u 10001 app \
    && apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=build /out/cli /app/cli
USER app
ENTRYPOINT ["/app/cli"]
