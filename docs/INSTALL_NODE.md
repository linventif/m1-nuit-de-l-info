# Installing Node.js

Node.js is required for running JavaScript on the server and using npm/bun package managers.

## 🐧 Linux

### Using Package Manager (Recommended)

**Ubuntu/Debian:**
```bash
# Install from NodeSource repository (Node.js 20.x LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Fedora/RHEL/CentOS:**
```bash
# Install from NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify installation
node --version
npm --version
```

**Arch Linux:**
```bash
sudo pacman -S nodejs npm

# Verify installation
node --version
npm --version
```

### Using NVM (Node Version Manager) - Recommended for Development

NVM allows you to install and switch between multiple Node.js versions:

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell configuration
source ~/.bashrc
# or
source ~/.zshrc

# Install Node.js LTS
nvm install --lts

# Use installed version
nvm use --lts

# Set default version
nvm alias default node

# Verify installation
node --version
npm --version
```

## 🍎 macOS

### Using Homebrew (Recommended)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

### Using NVM

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
nvm alias default node

# Verify installation
node --version
npm --version
```

## 🪟 Windows

### Using Official Installer

1. Download the installer from [nodejs.org](https://nodejs.org/)
2. Run the `.msi` installer
3. Follow the installation wizard
4. Restart your terminal/command prompt

```powershell
# Verify installation
node --version
npm --version
```

### Using Chocolatey

```powershell
# Install Chocolatey if not already installed
# Run PowerShell as Administrator

# Install Node.js
choco install nodejs-lts

# Verify installation
node --version
npm --version
```

### Using NVM for Windows

1. Download NVM for Windows from [GitHub](https://github.com/coreybutler/nvm-windows/releases)
2. Run the installer
3. Open a new command prompt or PowerShell

```powershell
# Install Node.js LTS
nvm install lts
nvm use lts

# Verify installation
node --version
npm --version
```

## ✅ Verify Installation

After installation, verify everything works:

```bash
# Check Node.js version
node --version
# Should output: v20.x.x or higher

# Check npm version
npm --version
# Should output: 10.x.x or higher

# Test Node.js
node -e "console.log('Node.js is working!')"
```

## 🔧 Common Issues

### Permission Errors (Linux/macOS)

If you get permission errors with npm:

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH

# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

### Node Version Issues

If you need a specific Node.js version:

```bash
# With NVM
nvm install 20
nvm use 20
nvm alias default 20
```

### PATH Issues (Windows)

If `node` command is not found:
1. Open System Properties → Environment Variables
2. Add Node.js installation path to PATH
3. Default: `C:\Program Files\nodejs\`
4. Restart terminal

## 📚 Next Steps

After installing Node.js:
1. [Install Bun](./INSTALL_BUN.md)
2. [Install Docker](./INSTALL_DOCKER.md)
3. Return to [main README](../README.md)

## 🔗 Resources

- [Official Node.js Documentation](https://nodejs.org/docs/)
- [NVM Documentation](https://github.com/nvm-sh/nvm)
- [npm Documentation](https://docs.npmjs.com/)
