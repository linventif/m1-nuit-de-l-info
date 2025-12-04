# Installing Docker

Docker is a platform for developing, shipping, and running applications in containers.

## 🐧 Linux

### Ubuntu/Debian

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
# Or run: newgrp docker

# Verify installation
docker --version
docker compose version
```

### Fedora/RHEL/CentOS

```bash
# Install prerequisites
sudo dnf -y install dnf-plugins-core

# Add Docker repository
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

# Install Docker
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### Arch Linux

```bash
# Install Docker
sudo pacman -S docker docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

## 🍎 macOS

### Using Docker Desktop (Recommended)

1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Double-click `Docker.dmg` to open the installer
3. Drag the Docker icon to Applications folder
4. Launch Docker Desktop from Applications
5. Follow the on-screen instructions
6. Docker Desktop will start automatically

```bash
# Verify installation
docker --version
docker compose version
```

### Using Homebrew

```bash
# Install Docker Desktop via Homebrew
brew install --cask docker

# Launch Docker Desktop
open -a Docker

# Verify installation
docker --version
docker compose version
```

## 🪟 Windows

### Using Docker Desktop (Recommended)

#### Prerequisites
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
- OR Windows 11 64-bit: Home, Pro, Enterprise, or Education
- WSL 2 feature enabled

#### Installation

1. **Enable WSL 2** (if not already enabled)
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   
   # Restart your computer
   ```

2. **Download Docker Desktop**
   - Visit [docker.com](https://www.docker.com/products/docker-desktop/)
   - Download Docker Desktop for Windows

3. **Install Docker Desktop**
   - Run the installer
   - Follow installation wizard
   - Choose "Use WSL 2 instead of Hyper-V" when prompted
   - Restart computer if required

4. **Start Docker Desktop**
   - Launch Docker Desktop from Start Menu
   - Accept the service agreement
   - Wait for Docker Engine to start

```powershell
# Verify installation
docker --version
docker compose version
```

### Using Chocolatey

```powershell
# Run PowerShell as Administrator
choco install docker-desktop

# Restart computer
# Launch Docker Desktop

# Verify installation
docker --version
docker compose version
```

## ✅ Verify Installation

After installation on any platform:

```bash
# Check Docker version
docker --version
# Should output: Docker version 24.x.x or higher

# Check Docker Compose version
docker compose version
# Should output: Docker Compose version v2.x.x or higher

# Test Docker installation
docker run hello-world
# Should download and run a test container

# Check Docker is running
docker ps
# Should show an empty list if no containers are running
```

## 🔧 Post-Installation Setup

### Linux - Run Docker without sudo

```bash
# Create docker group (usually already exists)
sudo groupadd docker

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Verify you can run docker without sudo
docker run hello-world
```

### Configure Docker to start on boot

**Linux:**
```bash
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

**macOS/Windows:**
- Docker Desktop starts automatically by default
- Can be configured in Docker Desktop settings

## 🐳 Basic Docker Commands

```bash
# View Docker info
docker info

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List images
docker images

# Pull an image
docker pull ubuntu

# Run a container
docker run -it ubuntu bash

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# Remove an image
docker rmi <image_id>

# View logs
docker logs <container_id>

# Execute command in running container
docker exec -it <container_id> bash
```

## 🔧 Docker Compose Commands

```bash
# Start services
docker compose up

# Start in detached mode
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# Rebuild containers
docker compose up --build

# Stop and remove volumes
docker compose down -v

# List running services
docker compose ps
```

## 🔧 Common Issues

### Docker daemon not running

**Linux:**
```bash
sudo systemctl start docker
sudo systemctl status docker
```

**macOS/Windows:**
- Make sure Docker Desktop is running
- Restart Docker Desktop from the menu

### Permission denied errors (Linux)

```bash
# Make sure you're in the docker group
groups

# If docker group is not listed
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo
sudo docker ps
```

### WSL 2 issues (Windows)

```powershell
# Update WSL
wsl --update

# Set WSL 2 as default
wsl --set-default-version 2

# Check WSL version
wsl -l -v
```

### Port already in use

```bash
# Find what's using the port
sudo lsof -i :3000

# Stop Docker containers using the port
docker ps
docker stop <container_id>
```

### Disk space issues

```bash
# Remove unused containers, networks, and images
docker system prune

# Remove all unused data including volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

## 📊 Docker Desktop Settings (macOS/Windows)

1. **Resources**: Configure CPU, Memory, Disk space
   - Recommended: 4 CPUs, 8GB RAM for development
2. **File Sharing**: Ensure project directory is accessible
3. **Kubernetes**: Can enable if needed (not required for this project)

## 🔥 Useful Docker Tips

```bash
# View resource usage
docker stats

# Clean up everything (BE CAREFUL!)
docker system prune -a --volumes

# Build and run in one command
docker compose up --build

# Run specific service
docker compose up db

# Scale services
docker compose up --scale api=3

# View environment variables
docker compose config

# Restart a service
docker compose restart api
```

## 📚 Next Steps

After installing Docker:
1. Ensure [Node.js](./INSTALL_NODE.md) is installed
2. Ensure [Bun](./INSTALL_BUN.md) is installed
3. Return to [main README](../README.md)
4. See [Docker Guide](./DOCKER.md) for project-specific usage

## 🔗 Resources

- [Official Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [WSL 2 Documentation](https://docs.microsoft.com/en-us/windows/wsl/)

## 🆘 Getting Help

If you encounter issues:

1. Check [Docker Documentation](https://docs.docker.com/)
2. Search [Docker Forums](https://forums.docker.com/)
3. Check [Stack Overflow](https://stackoverflow.com/questions/tagged/docker)
4. Visit [Docker GitHub Issues](https://github.com/docker/docker/issues)
