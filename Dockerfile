# -------------------------------
# 1️⃣ Base Image for Dependencies
# -------------------------------
    FROM node:18-alpine AS deps

    # Install dependencies needed for sharp & other native modules
    RUN apk add --no-cache libc6-compat python3 make g++ 
    
    WORKDIR /app
    
    # Copy package files
    COPY package.json package-lock.json* yarn.lock* ./
    
    # Install dependencies (prefer npm but fall back to yarn)
    RUN if [ -f package-lock.json ]; then npm ci; \
        elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
        else npm install; fi
    
    
    # -------------------------------
    # 2️⃣ Build Stage
    # -------------------------------
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Set production environment
    ENV NODE_ENV=production
    
    # Build Next.js app
    RUN npm run build
    
    
    # -------------------------------
    # 3️⃣ Production Runtime
    # -------------------------------
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Don't run as root
    RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
    USER nextjs
    
    # Copy built app from builder
    COPY --from=builder /app/next.config.js ./
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    
    # Expose frontend port
    EXPOSE 3000
    
    # Run Next.js server
    CMD ["npm", "start"]
    