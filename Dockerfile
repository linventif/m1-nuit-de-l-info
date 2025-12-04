FROM oven/bun:1.1.38 AS base
WORKDIR /app

# Copy root configuration files
COPY package.json bun.lockb* turbo.json ./

# Copy workspace package.json files
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN bun install

# API target
FROM base AS api
COPY apps/api ./apps/api
EXPOSE 3001
CMD ["bun", "run", "apps/api/src/index.js"]

# Web target
FROM base AS web
COPY apps/web ./apps/web
COPY turbo.json ./
EXPOSE 3000
CMD ["bun", "run", "dev"]

# Production build
FROM base AS builder
COPY . .
RUN bun run build

FROM oven/bun:1.1.38-slim AS production
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000 3001
