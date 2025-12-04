# Installing Bun

Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

## 🐧 Linux & 🍎 macOS

### Using Install Script (Recommended)

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# The script will:
# 1. Download the latest version of Bun
# 2. Install it to ~/.bun/bin
# 3. Add it to your PATH

# Reload your shell configuration
source ~/.bashrc
# or for zsh
source ~/.zshrc

# Verify installation
bun --version
```

### Manual Installation

```bash
# Download and extract Bun
curl -fsSL https://github.com/oven-sh/bun/releases/latest/download/bun-linux-x64.zip -o bun.zip
unzip bun.zip
sudo mv bun-linux-x64/bun /usr/local/bin/bun

# Make executable
sudo chmod +x /usr/local/bin/bun

# Verify installation
bun --version
```

### Using Homebrew (macOS)

```bash
# Install via Homebrew
brew tap oven-sh/bun
brew install bun

# Verify installation
bun --version
```

## 🪟 Windows

### Using PowerShell (Recommended)

```powershell
# Run in PowerShell
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

### Using WSL (Windows Subsystem for Linux)

If you're using WSL:

```bash
# Inside WSL terminal
curl -fsSL https://bun.sh/install | bash

# Reload shell
source ~/.bashrc

# Verify installation
bun --version
```

### Manual Installation (Windows)

1. Download the latest release from [Bun Releases](https://github.com/oven-sh/bun/releases)
2. Extract `bun-windows-x64.zip`
3. Add the extracted folder to your PATH:
   - Open System Properties → Environment Variables
   - Add the Bun installation folder to PATH
4. Restart your terminal

## ✅ Verify Installation

After installation:

```bash
# Check Bun version
bun --version
# Should output: 1.x.x or higher

# Test Bun
bun -e "console.log('Bun is working!')"

# Check available commands
bun --help
```

## 🚀 Basic Bun Commands

```bash
# Install dependencies
bun install

# Run a file
bun run index.js

# Run with watch mode
bun --watch index.js

# Create a new project
bun init

# Run tests
bun test

# Execute package.json scripts
bun run dev
bun run build

# Add a package
bun add package-name

# Remove a package
bun remove package-name

# Update packages
bun update
```

## 🔧 Upgrading Bun

### Linux & macOS

```bash
# Upgrade to latest version
bun upgrade

# Or reinstall
curl -fsSL https://bun.sh/install | bash
```

### Windows

```powershell
# Upgrade to latest version
bun upgrade

# Or reinstall
powershell -c "irm bun.sh/install.ps1 | iex"
```

## 🔧 Common Issues

### Command Not Found

If `bun` command is not found after installation:

**Linux/macOS:**
```bash
# Add to PATH manually (add to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.bun/bin:$PATH"

# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

**Windows:**
1. Open System Properties → Environment Variables
2. Add Bun installation path to PATH
3. Default: `%USERPROFILE%\.bun\bin`
4. Restart terminal

### Permission Errors (Linux/macOS)

```bash
# If you get permission errors
sudo chown -R $USER:$USER ~/.bun

# Or reinstall without sudo
curl -fsSL https://bun.sh/install | bash
```

### Slow Installation

If installation is slow:

```bash
# Use a specific version
curl -fsSL https://bun.sh/install | bash -s "bun-v1.1.38"
```

## 🆚 Bun vs npm/yarn

Bun is significantly faster than npm/yarn:

| Task | npm | yarn | bun |
|------|-----|------|-----|
| Install | ~30s | ~20s | ~2s |
| Run script | ~500ms | ~300ms | ~20ms |

```bash
# Convert from npm to bun
npm install  →  bun install
npm run dev  →  bun dev
npx          →  bunx
```

## 📦 Package Manager Comparison

```bash
# Install dependencies
npm install     →  bun install
yarn            →  bun install

# Add package
npm install pkg    →  bun add pkg
yarn add pkg       →  bun add pkg

# Add dev dependency
npm install -D pkg →  bun add -d pkg
yarn add -D pkg    →  bun add -d pkg

# Remove package
npm uninstall pkg  →  bun remove pkg
yarn remove pkg    →  bun remove pkg

# Run script
npm run dev    →  bun dev
yarn dev       →  bun dev

# Execute package
npx create-app →  bunx create-app
```

## 🔥 Bun Features

### Built-in Tools
- **Package Manager**: Fast, npm-compatible
- **Bundler**: Built-in bundling and minification
- **Test Runner**: `bun test`
- **TypeScript**: Native TypeScript support
- **Watch Mode**: Auto-restart on file changes

### Performance
- 3-4x faster than Node.js for many tasks
- ~25x faster package installation than npm
- Native TypeScript and JSX support

### Compatibility
- Drop-in replacement for Node.js
- Works with existing npm packages
- Compatible with Node.js APIs

## 📚 Next Steps

After installing Bun:
1. Make sure [Node.js](./INSTALL_NODE.md) is also installed (for compatibility)
2. [Install Docker](./INSTALL_DOCKER.md)
3. Return to [main README](../README.md) and run `bun install`

## 🔗 Resources

- [Official Bun Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Bun Discord Community](https://bun.sh/discord)
- [Bun vs Node.js Benchmarks](https://bun.sh/docs/runtime/nodejs-apis)

## 💡 Tips

```bash
# Use bun as your default package manager
bun config set install.lockfile bun.lockb

# Speed up installs with cache
bun install --ignore-scripts

# Run multiple commands
bun run build && bun run start

# Use environment variables
DATABASE_URL=xxx bun run dev

# Run TypeScript directly
bun run file.ts  # No compilation needed!
```
