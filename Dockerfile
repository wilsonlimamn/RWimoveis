# Multi-stage Dockerfile for RWimóveis Fullstack Application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build Vite frontend and bundled Node server
RUN npm run build

# Production runner image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built artifacts and production dependencies
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/schema.sql ./schema.sql

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
