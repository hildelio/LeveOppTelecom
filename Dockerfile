# ==============================================================
# Multi-Stage Dockerfile — Telecom Multi-Tenant
# Build argument TENANT selects which .env file to use
# ==============================================================

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Accept tenant name as build argument (default: leve)
ARG TENANT=leve

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build with the correct tenant mode
# Vite --mode reads .env.{TENANT} automatically
RUN npm run build -- --mode ${TENANT}

# ── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:1.27-alpine AS serve

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
