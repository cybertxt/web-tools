# Web Tools Platform

A modern, multilingual web platform providing various developer tools including base64 encoding/decoding, JSON formatter/validator, protobuf debug string formatter, unicode encoder/decoder, and more.

## 🚀 Features

- **Multiple Tools**: Base64, JSON, Protobuf, Unicode, URL, HTML encoding/decoding
- **Modern UI**: Clean, responsive design with dark/light theme support
- **Multilingual**: Support for 8+ languages
- **Expandable**: Easy to add new tools with plugin architecture
- **Fast**: Built with React + Vite frontend and Go backend

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Go + Gin framework
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Package Manager**: pnpm

## 📁 Project Structure

```
web-tools/
├── frontend/                 # React frontend application
├── backend/                  # Go backend API
├── shared/                   # Shared types and utilities
├── docs/                     # Documentation
├── scripts/                  # Build and deployment scripts
└── ROADMAP.md               # Implementation roadmap
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- Go 1.21+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-tools
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   cd frontend
   pnpm install
   
   # Backend dependencies
   cd ../backend
   go mod tidy
   ```

3. **Start development servers**
   ```bash
   # Terminal 1: Start frontend
   cd frontend
   pnpm dev
   
   # Terminal 2: Start backend
   cd backend
   go run cmd/server/main.go
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 📋 Available Tools

- **Base64 Encoder/Decoder**: Encode and decode Base64 strings
- **JSON Formatter/Validator**: Format and validate JSON data
- **Protobuf Debug String Formatter**: Format protobuf debug strings
- **Unicode Encoder/Decoder**: Encode and decode Unicode characters
- **URL Encoder/Decoder**: Encode and decode URL parameters
- **HTML Encoder/Decoder**: Encode and decode HTML entities

## 🌐 Internationalization

Supported languages:
- English (en) - Default
- Chinese Simplified (zh-CN)
- Chinese Traditional (zh-TW)
- Japanese (ja)
- Korean (ko)
- Spanish (es)
- French (fr)
- German (de)

## 🧪 Testing

```bash
# Frontend tests
cd frontend
pnpm test

# Backend tests
cd backend
go test ./...
```

## 📦 Building for Production

```bash
# Frontend build
cd frontend
pnpm build

# Backend build
cd backend
go build -o bin/server cmd/server/main.go
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For questions and support, please open an issue on GitHub.

---

*Built with ❤️ using modern web technologies* 