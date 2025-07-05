#!/bin/bash

# Web Tools Platform Setup Script
# This script sets up the development environment for the web-tools-platform

set -e

echo "🚀 Setting up Web Tools Platform development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js version: $(node --version)"
    
    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm
    fi
    
    print_success "pnpm version: $(pnpm --version)"
    
    # Check Go
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go 1.21+ first."
        exit 1
    fi
    
    GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//' | cut -d'.' -f2)
    if [ "$GO_VERSION" -lt 21 ]; then
        print_error "Go version 1.21+ is required. Current version: $(go version)"
        exit 1
    fi
    
    print_success "Go version: $(go version)"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_warning "Git is not installed. Some features may not work properly."
    else
        print_success "Git version: $(git --version)"
    fi
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    cd frontend
    pnpm install
    cd ..
    print_success "Frontend dependencies installed"
}

# Install backend dependencies
install_backend_deps() {
    print_status "Installing backend dependencies..."
    cd backend
    go mod tidy
    cd ..
    print_success "Backend dependencies installed"
}

# Build shared package
build_shared() {
    print_status "Building shared package..."
    cd shared
    pnpm install
    pnpm build
    cd ..
    print_success "Shared package built"
}

# Create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Frontend .env
    if [ ! -f frontend/.env ]; then
        cat > frontend/.env << EOF
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Web Tools Platform
VITE_APP_VERSION=1.0.0
EOF
        print_success "Created frontend/.env"
    fi
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        cat > backend/.env << EOF
PORT=8080
ENV=development
DB_PATH=./data/web-tools.db
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
EOF
        print_success "Created backend/.env"
    fi
    
    # Create data directory
    mkdir -p backend/data
    print_success "Created data directory"
}

# Initialize Git repository
init_git() {
    if [ ! -d .git ]; then
        print_status "Initializing Git repository..."
        git init
        git add .
        git commit -m "Initial commit: Project structure setup"
        print_success "Git repository initialized"
    else
        print_status "Git repository already exists"
    fi
}

# Main setup function
main() {
    print_status "Starting Web Tools Platform setup..."
    
    check_prerequisites
    install_frontend_deps
    install_backend_deps
    build_shared
    create_env_files
    init_git
    
    print_success "🎉 Setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "  1. Start development servers: pnpm dev"
    echo "  2. Frontend will be available at: http://localhost:5173"
    echo "  3. Backend API will be available at: http://localhost:8080"
    echo "  4. API documentation will be available at: http://localhost:8080/swagger"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@" 