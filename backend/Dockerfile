# --- build stage -------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy csproj and restore first (better layer caching)
COPY *.csproj ./
RUN dotnet restore 


COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

# --- runtime stage -----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Create group/user only if they don't exist (Debian-based image)
RUN groupadd -g 10001 app || true \
 && id -u app >/dev/null 2>&1 || useradd -u 10001 -g app -s /usr/sbin/nologin -m app
# Ensure ownership
RUN chown -R app:app /app

USER app

COPY --from=build /app/publish ./

# Listen on 5198 in container
ENV ASPNETCORE_URLS=http://+:5198 \
    ASPNETCORE_ENVIRONMENT=Development


EXPOSE 5198
ENTRYPOINT ["dotnet", "backend.dll"]
