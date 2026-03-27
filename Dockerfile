# Stage 1: Build Image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package info
COPY package*.json ./

# Install dependencies needed for build
RUN npm install

# Copy source code and Prisma schema
COPY . .

# Generate Prisma Client natively within builder schema
RUN npx prisma generate

# Build the NestJS application transpile
RUN npm run build

# Stage 2: Production Image
FROM node:20-alpine AS production

WORKDIR /app

# Copy only package.json to manage scopes
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy generated Prisma files and build artifacts natively from builder abstraction
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment configurations bind
ENV PORT=3000
ENV NODE_ENV=production

# Expose API port seamlessly
EXPOSE 3000

# Start gracefully
CMD ["node", "dist/main"]
