#!/bin/bash

# Web Tools Platform - Production Build Script
# This script builds both frontend and backend for production deployment

set -e  # Exit on error

echo "🚀 Building Web Tools Platform for Production"
echo "============================================="

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create build directory
BUILD_DIR="build"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

echo "📦 Building Frontend..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    pnpm install
fi

# Build frontend
echo "🔨 Building frontend for production..."
pnpm build

# Copy frontend build to build directory
cp -r dist/* ../$BUILD_DIR/
echo "✅ Frontend build complete"

cd ..

echo "🔧 Building Backend..."
cd backend

# Tidy Go modules
go mod tidy

# Build Go binary
echo "🔨 Building backend binary..."
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ../build/web-tools-server cmd/server/main.go

echo "✅ Backend build complete"

cd ..

echo "📋 Creating deployment package..."

# Create deployment files
cat > $BUILD_DIR/start.sh << 'EOF'
#!/bin/bash
# Start script for Web Tools Platform

export PORT=${PORT:-8080}
export ENV=${ENV:-production}
export LOG_LEVEL=${LOG_LEVEL:-info}

echo "Starting Web Tools Platform on port $PORT"
./web-tools-server
EOF

chmod +x $BUILD_DIR/start.sh

# Create Dockerfile
cat > $BUILD_DIR/Dockerfile << 'EOF'
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy built files
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S webapp && \
    adduser -S webapp -u 1001

# Change ownership
RUN chown -R webapp:webapp /app
USER webapp

EXPOSE 8080

CMD ["./web-tools-server"]
EOF

# Create docker-compose.yml
cat > $BUILD_DIR/docker-compose.yml << 'EOF'
version: '3.8'

services:
  web-tools:
    build: .
    ports:
      - "8080:8080"
    environment:
      - ENV=production
      - LOG_LEVEL=info
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF

# Create .env.example
cat > $BUILD_DIR/.env.example << 'EOF'
# Environment Configuration for Web Tools Platform

# Server Configuration
PORT=8080
ENV=production
LOG_LEVEL=info

# CORS Configuration (for production, set to your frontend domain)
CORS_ORIGIN=https://your-domain.com

# Optional: Database connection (if added in future)
# DATABASE_URL=sqlite://./data.db
EOF

# Create README for deployment
cat > $BUILD_DIR/README.md << 'EOF'
# Web Tools Platform - Production Build

This directory contains the production build of the Web Tools Platform.

## Quick Start

### Option 1: Direct Binary
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Docker
```bash
docker build -t web-tools .
docker run -p 8080:8080 web-tools
```

### Option 3: Docker Compose
```bash
docker-compose up -d
```

## Configuration

Copy `.env.example` to `.env` and customize as needed:
```bash
cp .env.example .env
```

## Health Check

Visit: http://localhost:8080/health

## API Documentation

Visit: http://localhost:8080/api/tools
EOF

echo "📊 Build Summary"
echo "=================="
echo "✅ Frontend built and copied to $BUILD_DIR/"
echo "✅ Backend binary: $BUILD_DIR/web-tools-server"
echo "✅ Deployment files created:"
echo "   - start.sh (startup script)"
echo "   - Dockerfile (container deployment)"
echo "   - docker-compose.yml (orchestration)"
echo "   - .env.example (environment template)"
echo "   - README.md (deployment instructions)"

# Get build size
FRONTEND_SIZE=$(du -sh $BUILD_DIR/*.html $BUILD_DIR/*.js $BUILD_DIR/*.css 2>/dev/null | awk '{sum+=$1} END {print sum "K"}' || echo "N/A")
BACKEND_SIZE=$(du -sh $BUILD_DIR/web-tools-server | awk '{print $1}')

echo ""
echo "📈 Build Statistics"
echo "==================="
echo "Frontend bundle size: $FRONTEND_SIZE"
echo "Backend binary size: $BACKEND_SIZE"
echo "Total build size: $(du -sh $BUILD_DIR | awk '{print $1}')"

echo ""
echo "🚀 Ready for Deployment!"
echo "========================"
echo "The build directory '$BUILD_DIR' contains everything needed for production deployment."
echo ""
echo "Next steps:"
echo "1. Copy the build directory to your server"
echo "2. Configure environment variables (copy .env.example to .env)"
echo "3. Run ./start.sh or use Docker deployment"
echo ""
echo "For detailed deployment instructions, see: docs/DEPLOYMENT.md" 