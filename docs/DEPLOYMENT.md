# Web Tools Platform - Deployment Guide

## 🚀 Quick Start (Local Development)

Both backend and frontend are currently running and ready to use:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

### Current Status
✅ Backend running on port 8080  
✅ Frontend running on port 5173  
✅ All 5 tools functional (Base64, JSON, URL, HTML, Unicode)

## 📋 Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **Go** 1.21+
- **Git**

## 🔧 Local Development Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd web-tools
pnpm install
cd backend && go mod tidy && cd ..
```

### 2. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
go run cmd/server/main.go

# Terminal 2 - Frontend  
cd frontend
pnpm dev
```

### 3. Access the Application
- **Web Interface**: http://localhost:5173
- **API Documentation**: http://localhost:8080/api/tools

## 🏗️ Production Build

### Frontend Production Build
```bash
cd frontend
pnpm build
```
This creates a `dist/` folder with optimized static files.

### Backend Production Build
```bash
cd backend
go build -o web-tools-server cmd/server/main.go
```

## 🌐 Deployment Options

### Option 1: Simple Static + API Deployment

**Frontend (Static)**: Deploy `frontend/dist/` to any static hosting:
- **Netlify**: Connect GitHub repo, build command: `cd frontend && pnpm build`
- **Vercel**: Same as Netlify
- **GitHub Pages**: Upload `dist/` contents
- **AWS S3 + CloudFront**: Upload to S3 bucket

**Backend (API)**: Deploy Go binary to cloud service:
- **Railway**: `railway deploy` 
- **Heroku**: Create `Procfile` with `web: ./web-tools-server`
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS EC2**: Upload binary and run

### Option 2: Containerized Deployment (Docker)

Create `Dockerfile` in project root:
```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY frontend/ .
RUN pnpm build

FROM golang:1.21-alpine AS backend-build
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN go build -o server cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=backend-build /app/backend/server .
COPY --from=frontend-build /app/frontend/dist ./dist
EXPOSE 8080
CMD ["./server"]
```

**Deploy to:**
- **Docker Hub + Cloud Run**: `docker build -t web-tools . && docker push`
- **Railway**: `railway deploy --dockerfile`
- **AWS ECS/Fargate**: Use Docker image

### Option 3: Serverless Deployment

**Frontend**: Same as Option 1 (static hosting)

**Backend**: Convert to serverless functions:
- **Vercel Functions**: Convert Go handlers to Vercel API routes
- **Netlify Functions**: Convert to Netlify functions
- **AWS Lambda**: Package Go binary for Lambda

### Option 4: VPS/Dedicated Server

1. **Prepare Server** (Ubuntu/CentOS):
```bash
# Install dependencies
sudo apt update
sudo apt install nginx golang-1.21 nodejs npm -y
npm install -g pnpm
```

2. **Deploy Application**:
```bash
# Build and copy files
scp -r frontend/dist/ user@server:/var/www/web-tools/
scp backend/web-tools-server user@server:/opt/web-tools/

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/web-tools
sudo ln -s /etc/nginx/sites-available/web-tools /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# Create systemd service for backend
sudo cp web-tools.service /etc/systemd/system/
sudo systemctl enable web-tools
sudo systemctl start web-tools
```

## ⚙️ Environment Configuration

### Backend Environment Variables
```bash
# .env file in backend/
PORT=8080
ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables
```bash
# .env file in frontend/
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔒 Security Considerations

- [ ] **HTTPS**: Enable SSL/TLS certificates
- [ ] **CORS**: Configure proper CORS origins
- [ ] **Rate Limiting**: Add rate limiting to API endpoints
- [ ] **Input Validation**: Already implemented in Go backend
- [ ] **Content Security Policy**: Add CSP headers
- [ ] **Environment Variables**: Never commit secrets to git

## 📊 Performance Optimization

- [ ] **Frontend**: Already optimized with Vite
- [ ] **Backend**: Add gzip compression
- [ ] **CDN**: Use CDN for static assets
- [ ] **Caching**: Add appropriate cache headers
- [ ] **Database**: Not needed for current tools

## 🔍 Monitoring & Health Checks

### Health Endpoint
- **URL**: `/health`
- **Response**: `{"status":"healthy","timestamp":"...","version":"1.0.0"}`

### Basic Monitoring
- Monitor `/health` endpoint
- Check response times for `/api/tools`
- Monitor server resources (CPU, memory)

## 🆘 Troubleshooting

### Common Issues

**1. CORS Errors**
- Check `CORS_ORIGIN` environment variable
- Ensure frontend and backend URLs match

**2. API Connection Failed**
- Verify `VITE_API_URL` in frontend
- Check backend is accessible from frontend domain

**3. Build Failures**
- Check Node.js and Go versions
- Clear caches: `pnpm clean` and `go clean -cache`

**4. Port Conflicts**
- Backend default: 8080 (configurable via `PORT` env var)
- Frontend dev: 5173 (Vite default)

### Debug Commands
```bash
# Check backend health
curl http://localhost:8080/health

# Test API endpoint
curl http://localhost:8080/api/tools

# Check frontend build
cd frontend && pnpm build && pnpm preview
```

## 📚 Additional Resources

- **Go Gin Documentation**: https://gin-gonic.com/
- **React + Vite**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **pnpm Workspaces**: https://pnpm.io/workspaces

---

**Need Help?** Check the troubleshooting section or create an issue in the repository. 