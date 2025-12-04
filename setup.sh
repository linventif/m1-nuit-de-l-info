#!/bin/bash

# Nuit de l'Info - Quick Setup Script
# This script helps new developers set up the project quickly

set -e  # Exit on error

echo "🚀 Nuit de l'Info - Quick Setup"
echo "================================"
echo ""

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed!"
    echo "📚 Please install Bun first: https://bun.sh"
    echo "   Run: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun is installed: $(bun --version)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed!"
    echo "📚 Please install Docker: https://docs.docker.com/get-docker/"
    echo "   You can continue without Docker, but database features will be limited."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Docker is installed: $(docker --version)"
fi

# Check if docker-compose is available
if command -v docker &> /dev/null; then
    if docker compose version &> /dev/null; then
        echo "✅ Docker Compose is available"
    elif command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose is installed (standalone)"
    else
        echo "⚠️  Docker Compose is not available"
    fi
fi

echo ""
echo "📦 Installing dependencies..."
bun install

echo ""
echo "⚙️  Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "📝 You can edit .env to customize your configuration"
else
    echo "ℹ️  .env file already exists, skipping..."
fi

echo ""
if command -v docker &> /dev/null; then
    read -p "🐳 Do you want to start the database with Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting MariaDB container..."
        docker compose up db -d
        echo "✅ Database is starting up (this may take a few seconds)"
        echo "   Check status with: docker compose ps"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Start development servers:"
echo "      bun dev"
echo ""
echo "   2. Or start them separately:"
echo "      # Frontend: http://localhost:3000"
echo "      cd apps/web && bun dev"
echo ""
echo "      # Backend: http://localhost:3001"
echo "      cd apps/api && bun dev"
echo ""
echo "   3. Access the application:"
echo "      Frontend: http://localhost:3000"
echo "      Backend:  http://localhost:3001"
echo "      Health:   http://localhost:3001/health"
echo ""
echo "📖 Documentation:"
echo "   README.md - Project overview"
echo "   docs/GIT_WORKFLOW.md - Git workflow and branching"
echo "   docs/CONTRIBUTING.md - Coding standards and guidelines"
echo "   docs/FRONTEND.md - Frontend development guide"
echo "   docs/DATABASE.md - Database schema and queries"
echo ""
echo "🎉 Happy coding!"
