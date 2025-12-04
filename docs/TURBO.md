# Turbo Commands Guide

Turbo is a high-performance build system for JavaScript and TypeScript monorepos.

## 🚀 Basic Commands

### Running Tasks

```bash
# Run a task across all packages
bun turbo run build
bun turbo run dev
bun turbo run lint
bun turbo run test

# Short form (if turbo is in PATH)
turbo run build
turbo build  # Even shorter
```

### Filtering

```bash
# Run task in specific package
bun turbo run dev --filter=web
bun turbo run dev --filter=api

# Run in multiple packages
bun turbo run build --filter=web --filter=api

# Run in package and its dependencies
bun turbo run build --filter=web...

# Run in package and its dependents
bun turbo run build --filter=...web
```

## 📦 Package Filtering

### Filter Syntax

```bash
# Single package
--filter=web
--filter=api

# Multiple packages
--filter=web --filter=api

# Wildcard (all apps)
--filter="./apps/*"

# Changed files only
--filter=[HEAD^1]

# Scope patterns
--filter=@myorg/*
```

### Examples

```bash
# Run dev only in frontend
bun turbo run dev --filter=web

# Build only backend
bun turbo run build --filter=api

# Lint all apps
bun turbo run lint --filter="./apps/*"

# Run tests in all packages
bun turbo run test --filter="./packages/*"
```

## 🎯 Common Workflows

### Development

```bash
# Start all apps in dev mode
bun dev

# Start only frontend
bun turbo run dev --filter=web

# Start only backend
bun turbo run dev --filter=api

# Start with dependencies
bun turbo run dev --filter=web...
```

### Building

```bash
# Build everything
bun build

# Build specific package
bun turbo run build --filter=api

# Build with dependencies
bun turbo run build --filter=web...

# Force rebuild (ignore cache)
bun turbo run build --force
```

### Testing & Linting

```bash
# Run all linters
bun turbo run lint

# Lint specific package
bun turbo run lint --filter=web

# Run tests
bun turbo run test

# Test specific package
bun turbo run test --filter=api
```

## ⚡ Performance Options

### Caching

```bash
# Skip cache (force re-run)
bun turbo run build --force

# Clear cache
rm -rf .turbo
rm -rf node_modules/.cache/turbo

# Disable cache for a task
bun turbo run dev --no-cache
```

### Parallelization

```bash
# Run with specific concurrency
bun turbo run build --concurrency=10

# Run tasks serially
bun turbo run build --concurrency=1

# Max parallelism (default)
bun turbo run build
```

### Output

```bash
# Verbose output
bun turbo run build --verbose

# Only show errors
bun turbo run build --output-logs=errors-only

# Show all output
bun turbo run build --output-logs=full

# No output
bun turbo run build --output-logs=none
```

## 🔍 Inspecting & Debugging

### Dry Run

```bash
# See what would run without running it
bun turbo run build --dry-run

# See full command that would execute
bun turbo run build --dry-run=json
```

### Graph Visualization

```bash
# Generate dependency graph
bun turbo run build --graph

# Output graph as DOT file
bun turbo run build --graph=graph.html

# View with GraphViz
bun turbo run build --graph | dot -Tpng > graph.png
```

### Timing

```bash
# Show task timing
bun turbo run build --summarize

# Profile performance
bun turbo run build --profile=profile.json
```

## 📊 Pipeline Configuration

The `turbo.json` defines task pipelines:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

### Task Dependencies

```bash
# ^build means "run build in dependencies first"
"dependsOn": ["^build"]

# Run task after another in same package
"dependsOn": ["build"]

# Multiple dependencies
"dependsOn": ["^build", "codegen"]
```

## 🔧 Advanced Usage

### Environment Variables

```bash
# Pass environment variables
DATABASE_URL=xxx bun turbo run dev --filter=api

# Use .env files
bun turbo run dev --env-file=.env.local
```

### Remote Caching

```bash
# Enable remote caching
bun turbo login
bun turbo link

# Run with remote cache
bun turbo run build
```

### Continue on Error

```bash
# Don't stop on first error
bun turbo run test --continue
```

### Changed Files

```bash
# Run only for changed packages
bun turbo run build --filter=[HEAD^1]

# Since specific commit
bun turbo run test --filter=[main]

# Compare with branch
bun turbo run lint --filter=[origin/main]
```

## 💡 Tips & Tricks

### Aliases

Add to your `package.json`:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "turbo run dev --filter=api"
  }
}
```

### Watch Mode

```bash
# Watch for changes (if supported by underlying tool)
bun turbo run dev  # Already in watch mode for dev tasks

# Force watch
bun turbo run build --watch
```

### Clean

```bash
# Clean all build outputs
bun turbo run clean

# Clean and rebuild
bun turbo run clean && bun turbo run build
```

## 🐛 Troubleshooting

### Cache Issues

```bash
# Clear turbo cache
rm -rf .turbo
rm -rf node_modules/.cache/turbo

# Clear all caches
bun clean
find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
```

### Task Not Running

```bash
# Check task exists in package.json
cat apps/web/package.json | grep "scripts"

# Check turbo.json configuration
cat turbo.json

# Run with verbose output
bun turbo run build --filter=web --verbose
```

### Dependency Issues

```bash
# Check dependency graph
bun turbo run build --graph

# Reinstall dependencies
rm -rf node_modules
bun install
```

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `turbo run dev` | Run dev task in all packages |
| `turbo run build` | Build all packages |
| `turbo run build --filter=web` | Build specific package |
| `turbo run build --force` | Bypass cache |
| `turbo run build --dry-run` | Preview what would run |
| `turbo run build --graph` | Show dependency graph |
| `turbo run dev --filter=web...` | Run with dependencies |
| `turbo run build --continue` | Don't stop on errors |
| `turbo run build --concurrency=5` | Limit parallelism |
| `turbo run build --output-logs=errors-only` | Only show errors |

## 🔗 Resources

- [Turbo Documentation](https://turbo.build/repo/docs)
- [Filtering Workspaces](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)

## 📚 Next Steps

- Return to [main README](../README.md)
- See [Contributing Guidelines](./CONTRIBUTING.md)
- Check [Docker Guide](./DOCKER.md)
