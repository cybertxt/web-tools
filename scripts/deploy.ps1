# Web Tools Platform - Production Build Script (PowerShell)
# This script builds both frontend and backend for production deployment

$ErrorActionPreference = "Stop"

Write-Host "🚀 Building Web Tools Platform for Production" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if we're in the project root
if (-not (Test-Path "package.json") -or -not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Create build directory
$BuildDir = "build"
if (Test-Path $BuildDir) {
    Remove-Item -Recurse -Force $BuildDir
}
New-Item -ItemType Directory -Path $BuildDir | Out-Null

Write-Host "📦 Building Frontend..." -ForegroundColor Cyan
Set-Location frontend

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    pnpm install
}

# Build frontend
Write-Host "🔨 Building frontend for production..." -ForegroundColor Yellow
pnpm build

# Copy frontend build to build directory
Copy-Item -Recurse -Path "dist\*" -Destination "..\$BuildDir\"
Write-Host "✅ Frontend build complete" -ForegroundColor Green

Set-Location ..

Write-Host "🔧 Building Backend..." -ForegroundColor Cyan
Set-Location backend

# Tidy Go modules
go mod tidy

# Build Go binary for Windows and Linux
Write-Host "🔨 Building backend binary for Windows..." -ForegroundColor Yellow
$env:CGO_ENABLED = "0"
$env:GOOS = "windows"
go build -o "..\$BuildDir\web-tools-server.exe" "cmd\server\main.go"

Write-Host "🔨 Building backend binary for Linux..." -ForegroundColor Yellow
$env:GOOS = "linux"
go build -a -installsuffix cgo -o "..\$BuildDir\web-tools-server" "cmd\server\main.go"

Write-Host "✅ Backend build complete" -ForegroundColor Green

Set-Location ..

Write-Host "📋 Creating deployment package..." -ForegroundColor Cyan

# Create start script for Windows
@"
@echo off
REM Start script for Web Tools Platform (Windows)

if "%PORT%"=="" set PORT=8080
if "%ENV%"=="" set ENV=production
if "%LOG_LEVEL%"=="" set LOG_LEVEL=info

echo Starting Web Tools Platform on port %PORT%
web-tools-server.exe
"@ | Out-File -FilePath "$BuildDir\start.bat" -Encoding ASCII

# Create start script for Linux
@"
#!/bin/bash
# Start script for Web Tools Platform (Linux)

export PORT=${'$'}{PORT:-8080}
export ENV=${'$'}{ENV:-production}
export LOG_LEVEL=${'$'}{LOG_LEVEL:-info}

echo "Starting Web Tools Platform on port ${'$'}PORT"
./web-tools-server
"@ | Out-File -FilePath "$BuildDir\start.sh" -Encoding UTF8

# Create Dockerfile
@"
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
"@ | Out-File -FilePath "$BuildDir\Dockerfile" -Encoding UTF8

# Create docker-compose.yml
@"
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
"@ | Out-File -FilePath "$BuildDir\docker-compose.yml" -Encoding UTF8

# Create .env.example
@"
# Environment Configuration for Web Tools Platform

# Server Configuration
PORT=8080
ENV=production
LOG_LEVEL=info

# CORS Configuration (for production, set to your frontend domain)
CORS_ORIGIN=https://your-domain.com

# Optional: Database connection (if added in future)
# DATABASE_URL=sqlite://./data.db
"@ | Out-File -FilePath "$BuildDir\.env.example" -Encoding UTF8

# Create deployment README
@"
# Web Tools Platform - Production Build

This directory contains the production build of the Web Tools Platform.

## Quick Start

### Windows
``````batch
start.bat
``````

### Linux
``````bash
chmod +x start.sh
./start.sh
``````

### Docker
``````bash
docker build -t web-tools .
docker run -p 8080:8080 web-tools
``````

### Docker Compose
``````bash
docker-compose up -d
``````

## Configuration

Copy ``.env.example`` to ``.env`` and customize as needed:
``````bash
cp .env.example .env
``````

## Health Check

Visit: http://localhost:8080/health

## API Documentation

Visit: http://localhost:8080/api/tools
"@ | Out-File -FilePath "$BuildDir\README.md" -Encoding UTF8

Write-Host "📊 Build Summary" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green
Write-Host "✅ Frontend built and copied to $BuildDir/" -ForegroundColor Green
Write-Host "✅ Backend binaries created:" -ForegroundColor Green
Write-Host "   - web-tools-server.exe (Windows)" -ForegroundColor White
Write-Host "   - web-tools-server (Linux)" -ForegroundColor White
Write-Host "✅ Deployment files created:" -ForegroundColor Green
Write-Host "   - start.bat (Windows startup script)" -ForegroundColor White
Write-Host "   - start.sh (Linux startup script)" -ForegroundColor White
Write-Host "   - Dockerfile (container deployment)" -ForegroundColor White
Write-Host "   - docker-compose.yml (orchestration)" -ForegroundColor White
Write-Host "   - .env.example (environment template)" -ForegroundColor White
Write-Host "   - README.md (deployment instructions)" -ForegroundColor White

# Get build sizes
$FrontendFiles = Get-ChildItem "$BuildDir\*.html", "$BuildDir\*.js", "$BuildDir\*.css" -ErrorAction SilentlyContinue
$FrontendSize = if ($FrontendFiles) { 
    ($FrontendFiles | Measure-Object -Property Length -Sum).Sum / 1KB 
    "{0:F1}KB" -f $FrontendSize
} else { "N/A" }

$BackendSizeWin = if (Test-Path "$BuildDir\web-tools-server.exe") {
    $size = (Get-Item "$BuildDir\web-tools-server.exe").Length / 1MB
    "{0:F1}MB" -f $size
} else { "N/A" }

$BackendSizeLinux = if (Test-Path "$BuildDir\web-tools-server") {
    $size = (Get-Item "$BuildDir\web-tools-server").Length / 1MB
    "{0:F1}MB" -f $size
} else { "N/A" }

$TotalSize = if (Test-Path $BuildDir) {
    $size = (Get-ChildItem $BuildDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    "{0:F1}MB" -f $size
} else { "N/A" }

Write-Host ""
Write-Host "📈 Build Statistics" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "Frontend bundle size: $FrontendSize" -ForegroundColor White
Write-Host "Backend binary size (Windows): $BackendSizeWin" -ForegroundColor White
Write-Host "Backend binary size (Linux): $BackendSizeLinux" -ForegroundColor White
Write-Host "Total build size: $TotalSize" -ForegroundColor White

Write-Host ""
Write-Host "🚀 Ready for Deployment!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "The build directory '$BuildDir' contains everything needed for production deployment." -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the build directory to your server" -ForegroundColor White
Write-Host "2. Configure environment variables (copy .env.example to .env)" -ForegroundColor White
Write-Host "3. Run start.bat (Windows) or start.sh (Linux) or use Docker deployment" -ForegroundColor White
Write-Host ""
Write-Host "For detailed deployment instructions, see: docs/DEPLOYMENT.md" -ForegroundColor Cyan 