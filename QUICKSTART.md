# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:

- ✅ **Node.js** (v18+) - [Install Guide](./docs/INSTALL_NODE.md)
- ✅ **Bun** (v1.0+) - [Install Guide](./docs/INSTALL_BUN.md)
- ✅ **Docker** - [Install Guide](./docs/INSTALL_DOCKER.md)
- ✅ **Git** - Usually pre-installed

## Quick Setup (5 minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd m1-nuit-de-l-info

# Run setup script
chmod +x setup.sh
./setup.sh

# Start development
bun dev
```

### Option 2: Manual Setup

```bash
# 1. Clone and enter directory
git clone <repository-url>
cd m1-nuit-de-l-info

# 2. Install dependencies
bun install

# 3. Set up environment
cp .env.example .env

# 4. Start database
docker compose up db -d

# 5. Start development servers
bun dev
```

## Verify Installation

After starting the servers, verify everything works:

1. **Frontend**: Open http://localhost:3000
   - Should see the homepage with a counter demo

2. **Backend**: Open http://localhost:3001
   - Should see API information

3. **Health Check**: http://localhost:3001/health
   - Should show database connection status

4. **Users API**: http://localhost:3001/api/users
   - Should return sample users (John, Jane, Bob)

## Your First Contribution

1. **Create a branch**
   ```bash
   git checkout -b feature/my-first-feature
   ```

2. **Make a small change**
   - Edit `apps/web/src/pages/Home.jsx`
   - Change the welcome message

3. **See it live**
   - Save the file
   - Browser automatically refreshes
   - See your changes!

4. **Commit your change**
   ```bash
   git add .
   git commit -m "feat: update welcome message"
   git push origin feature/my-first-feature
   ```

5. **Create a Pull Request**
   - Go to GitHub/GitLab
   - Create PR from your branch to `develop`
   - Request a review!

## Common Commands

```bash
# Start everything
bun dev

# Start only frontend
cd apps/web && bun dev

# Start only backend
cd apps/api && bun dev

# Start only database
docker compose up db -d

# View logs
docker compose logs -f

# Stop everything
docker compose down

# Clean and reinstall
bun clean
bun install
```

## File Structure Overview

```
m1-nuit-de-l-info/
├── apps/
│   ├── web/          👉 Frontend (SolidJS)
│   │   ├── src/
│   │   │   ├── pages/      # Add new pages here
│   │   │   └── components/ # Add new components here
│   │   └── package.json
│   └── api/          👉 Backend (Express)
│       ├── src/
│       │   ├── models/      # Database models
│       │   ├── controllers/ # Business logic
│       │   └── routes/      # API endpoints
│       └── package.json
├── docs/             👉 Documentation
├── docker-compose.yml
└── package.json      👉 Root config
```

## What to Read Next

Depending on what you want to do:

**Want to code right away?**
- ✅ You're ready! Start with `bun dev`

**Want to understand the project?**
- 📖 Read [README.md](./README.md)

**Want to add a feature?**
- 📖 Read [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- 📖 See [EXAMPLES.md](./docs/EXAMPLES.md)

**Want to work on frontend?**
- 📖 Read [FRONTEND.md](./docs/FRONTEND.md)

**Want to work on backend?**
- 📖 Read [API.md](./apps/api/API.md)
- 📖 Read [DATABASE.md](./docs/DATABASE.md)

**Want to understand Git workflow?**
- 📖 Read [GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)

**Having issues?**
- 📖 See troubleshooting in [README.md](./README.md#-troubleshooting)

## Tips for Team Work

1. **Communicate early**: Tell team what you're working on
2. **Pull often**: `git pull origin develop` daily
3. **Small commits**: Easier to review and merge
4. **Ask questions**: Better to ask than to guess
5. **Help others**: Review PRs, share knowledge

## Get Help

- 💬 Team chat: [Your team chat link]
- 📝 Create issue: [GitHub/GitLab issues]
- 📚 Documentation: `docs/` folder

## You're Ready! 🎉

Start coding:
```bash
bun dev
```

Then open http://localhost:3000 and start building! 🚀
