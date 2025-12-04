# Nuit de l'Info - M1 Project

A modern monorepo setup for team collaboration (~13 developers) built with Turbo, Bun, SolidJS, Express, and MariaDB.

## 🏗️ Project Structure

```
m1-nuit-de-l-info/
├── apps/
│   ├── web/              # SolidJS frontend application
│   └── api/              # Express backend API
├── packages/             # Shared packages (add as needed)
├── docs/                 # Documentation
├── docker-compose.yml    # Docker orchestration
├── Dockerfile            # Multi-stage Docker build
├── turbo.json           # Turbo configuration
└── package.json         # Root package.json
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Installation Guide](./docs/INSTALL_NODE.md)
- **Bun** (v1.0 or higher) - [Installation Guide](./docs/INSTALL_BUN.md)
- **Docker & Docker Compose** - [Installation Guide](./docs/INSTALL_DOCKER.md)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd m1-nuit-de-l-info
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**

   ```bash
   docker compose up db -d
   ```

5. **Run the development servers**
   ```bash
   bun dev
   ```

This will start:

- Frontend (SolidJS) at `http://localhost:3000`
- Backend (Express) at `http://localhost:3001`

## 📦 Available Scripts

### Root Level Commands

```bash
# Start all apps in development mode
bun dev

# Build all apps
bun build

# Run linting
bun lint

# Format code
bun format

# Clean build artifacts
bun clean
```

### Turbo Commands

```bash
# Run dev for specific app
bun turbo run dev --filter=web
bun turbo run dev --filter=api

# Build specific app
bun turbo run build --filter=web
```

See [Turbo Documentation](./docs/TURBO.md) for more details.

## 🐳 Docker

### Development with Docker

```bash
# Start all services (database, API, web)
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build
```

### Database Only

```bash
# Start only the database
docker-compose up db -d

# View database logs
docker-compose logs -f db

# Access MariaDB shell
docker-compose exec db mariadb -u root -p
```

See [Docker Guide](./docs/DOCKER.md) for more details.

## 🛠️ Tech Stack

### Frontend (`apps/web`)

- **SolidJS** - Reactive UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **DaisyUI v5** - Component library
- **@solidjs/router** - Routing

### Backend (`apps/api`)

- **Express** - Web framework
- **Sequelize** - ORM for database operations
- **MariaDB** - Relational database
- **Bun** - JavaScript runtime

### DevOps

- **Turbo** - Monorepo build system
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📚 Documentation

- [Git Workflow](./docs/GIT_WORKFLOW.md) - Branching strategy and collaboration
- [Install Node.js](./docs/INSTALL_NODE.md)
- [Install Bun](./docs/INSTALL_BUN.md)
- [Install Docker](./docs/INSTALL_DOCKER.md)
- [Turbo Commands](./docs/TURBO.md)
- [Docker Guide](./docs/DOCKER.md)
- [API Documentation](./apps/api/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Frontend Structure](./docs/FRONTEND.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)

## 🤝 Team Collaboration

With ~13 developers working on this project, we follow these practices:

1. **File Separation**: Each feature should be in its own file/module
2. **Git Workflow**: Use feature branches and pull requests
3. **Code Reviews**: All PRs require at least one review
4. **Naming Conventions**: Follow the style guide in `CONTRIBUTING.md`
5. **Documentation**: Update docs when adding new features

See [Contributing Guidelines](./docs/CONTRIBUTING.md) for detailed workflow.

## 🔥 Common Commands

```bash
# Install dependencies
bun install

# Run development servers (all apps)
bun dev

# Run only the frontend
cd apps/web && bun dev

# Run only the API
cd apps/api && bun dev

# Create database tables and seed data
# The API will auto-create tables on first run

# View API health
curl http://localhost:3001/health

# Test API endpoints
curl http://localhost:3001/api/users
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues

```bash
# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up db -d
```

### Clear Cache

```bash
# Clear Turbo cache
bun clean

# Remove all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
bun install
```

## 📝 License

MIT

## 👥 Contributors

Built with ❤️ by the M1 team for Nuit de l'Info
