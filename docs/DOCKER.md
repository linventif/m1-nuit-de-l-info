# Docker Guide

Complete guide for using Docker with this project.

## 🚀 Quick Start

```bash
# Start everything (database + API + web)
docker-compose up

# Start in background
docker-compose up -d

# Stop everything
docker-compose down
```

## 📦 Services

This project uses three Docker services:

### 1. Database (MariaDB)
- **Container**: `nuit-info-db`
- **Port**: `3306`
- **Image**: `mariadb:11`
- **Volume**: Persistent data storage

### 2. API (Express + Bun)
- **Container**: `nuit-info-api`
- **Port**: `3001`
- **Build**: From Dockerfile
- **Hot Reload**: Enabled with `--watch`

### 3. Web (SolidJS + Vite)
- **Container**: `nuit-info-web`
- **Port**: `3000`
- **Build**: From Dockerfile
- **Hot Reload**: Enabled with Vite

## 🎯 Common Commands

### Starting Services

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up db
docker-compose up api
docker-compose up web

# Start in detached mode (background)
docker-compose up -d

# Start and rebuild containers
docker-compose up --build

# Start with specific services
docker-compose up db api
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Stop specific service
docker-compose stop api
docker-compose stop web
```

### Viewing Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs api
docker-compose logs -f db

# View last 100 lines
docker-compose logs --tail=100
```

### Managing Containers

```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart api

# Execute command in container
docker-compose exec api bash
docker-compose exec db mariadb -u root -p

# View container stats
docker stats
```

## 🗄️ Database Management

### Accessing Database

```bash
# Access MariaDB shell
docker-compose exec db mariadb -u root -p
# Password: password

# Or with user credentials
docker-compose exec db mariadb -u user -p nuit_info
# Password: password
```

### Database Commands

```sql
-- Inside MariaDB shell
SHOW DATABASES;
USE nuit_info;
SHOW TABLES;
SELECT * FROM users;
DESCRIBE users;
```

### Backup & Restore

```bash
# Backup database
docker-compose exec db mariadb-dump -u root -p nuit_info > backup.sql

# Restore database
docker-compose exec -T db mariadb -u root -p nuit_info < backup.sql
```

### Reset Database

```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up db -d
```

## 🛠️ Development Workflow

### Local Development (Recommended)

```bash
# Start only database in Docker
docker-compose up db -d

# Run API and Web locally
bun install
bun dev
```

**Advantages:**
- Faster hot reload
- Better debugging
- Lower resource usage

### Full Docker Development

```bash
# Start everything in Docker
docker-compose up

# Make code changes
# Changes are synced via volumes
# API restarts automatically (watch mode)
# Web rebuilds automatically (Vite HMR)
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3306 | xargs kill -9

# Or change ports in docker-compose.yml
ports:
  - "3307:3306"  # Map to different host port
```

### Container Won't Start

```bash
# Check logs
docker-compose logs api

# Check container status
docker-compose ps

# Rebuild container
docker-compose up --build api

# Remove and recreate
docker-compose down
docker-compose up --build
```

### Database Connection Issues

```bash
# Check database is healthy
docker-compose ps
# Should show "healthy" status

# Check database logs
docker-compose logs db

# Wait for database to be ready
docker-compose up db
# Wait for "ready for connections" message

# Test connection
docker-compose exec db mariadb -u root -p -e "SELECT 1"
```

### Volume Issues

```bash
# Remove all volumes (WARNING: deletes data)
docker-compose down -v

# Remove specific volume
docker volume ls
docker volume rm nuit-info_mariadb_data

# Inspect volume
docker volume inspect nuit-info_mariadb_data
```

### Build Issues

```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up

# Remove all images and rebuild
docker-compose down --rmi all
docker-compose up --build
```

### Permission Issues (Linux)

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# If docker group issues
sudo usermod -aG docker $USER
newgrp docker
```

## 🔍 Inspecting Containers

### Container Details

```bash
# Inspect container
docker inspect nuit-info-api

# View container processes
docker-compose top

# View container resource usage
docker stats

# View container networks
docker network ls
docker network inspect nuit-info_app-network
```

### File System

```bash
# Copy file from container
docker cp nuit-info-api:/app/logs/error.log ./error.log

# Copy file to container
docker cp ./config.json nuit-info-api:/app/config.json

# View file in container
docker-compose exec api cat /app/package.json
```

## 📊 Performance Optimization

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Multi-stage Builds

The Dockerfile uses multi-stage builds for optimization:

```dockerfile
# Development stage (with source code)
FROM base AS api

# Production stage (optimized)
FROM base AS production
```

## 🌐 Networking

### Inter-service Communication

```bash
# Services communicate via service names
# API connects to database using "db" as hostname

# Test connectivity
docker-compose exec api ping db
docker-compose exec web wget -O- http://api:3001/health
```

### External Access

```bash
# Access from host machine
curl http://localhost:3001/health
curl http://localhost:3000

# Access from another container
docker run --network nuit-info_app-network alpine ping db
```

## 🧹 Cleanup

### Remove Unused Resources

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything (CAREFUL!)
docker system prune -a --volumes
```

### Project Cleanup

```bash
# Stop and remove project containers
docker-compose down

# Remove project containers and volumes
docker-compose down -v

# Remove project containers, volumes, and images
docker-compose down -v --rmi all
```

## 🚢 Production Deployment

### Build for Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

```bash
# Use different .env file
docker-compose --env-file .env.production up

# Override variables
DATABASE_URL=xxx docker-compose up
```

## 💡 Tips & Best Practices

### Development

1. **Use named volumes** for data persistence
2. **Mount source code** for hot reload
3. **Keep containers running** for faster iteration
4. **Use healthchecks** for service dependencies

### Production

1. **Use multi-stage builds** to minimize image size
2. **Don't use root user** in containers
3. **Set resource limits** to prevent resource exhaustion
4. **Use secrets** for sensitive data
5. **Enable restart policies** for resilience

### Debugging

```bash
# Enter container shell
docker-compose exec api bash

# View environment variables
docker-compose exec api env

# Check network connectivity
docker-compose exec api ping db

# View running processes
docker-compose exec api ps aux
```

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all services |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | Follow logs |
| `docker-compose ps` | List containers |
| `docker-compose restart` | Restart services |
| `docker-compose exec api bash` | Enter API container |
| `docker-compose exec db mariadb -u root -p` | Enter database |
| `docker-compose build` | Rebuild images |
| `docker-compose up --build` | Rebuild and start |

## 🔗 Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Networking](https://docs.docker.com/network/)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)

## 📚 Next Steps

- Return to [main README](../README.md)
- See [Contributing Guidelines](./CONTRIBUTING.md)
- Check [Turbo Guide](./TURBO.md)
