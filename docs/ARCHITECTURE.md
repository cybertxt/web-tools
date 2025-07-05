# Web Tools Platform - Architecture Documentation

## 🏗️ System Overview

The Web Tools Platform is a modern, multilingual web application built with a microservices-inspired architecture. It consists of a React frontend and a Go backend, designed to be scalable, maintainable, and easily extensible.

## 📊 Architecture Diagram

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   React App     │◄──────────────►│   Go Backend    │
│   (Frontend)    │                 │   (API Server)  │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│   Browser       │                 │   SQLite/PostgreSQL │
│   Storage       │                 │   Database      │
└─────────────────┘                 └─────────────────┘
```

## 🎯 Design Principles

### 1. **Modularity**
- Each tool is a self-contained module
- Clear separation of concerns between frontend and backend
- Shared types and utilities for consistency

### 2. **Scalability**
- Stateless API design
- Horizontal scaling capability
- Efficient resource utilization

### 3. **Maintainability**
- Consistent coding standards
- Comprehensive documentation
- Automated testing

### 4. **Extensibility**
- Plugin architecture for tools
- Configurable settings
- Internationalization support

## 🏛️ Frontend Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand
- **Routing**: React Router v6
- **Package Manager**: pnpm

### Key Components

#### 1. **Tool Registry System**
```typescript
interface ToolRegistry {
  register(tool: Tool): void;
  getTool(id: string): Tool | undefined;
  getAllTools(): Tool[];
  getToolsByCategory(category: ToolCategory): Tool[];
}
```

#### 2. **State Management**
```typescript
interface AppState {
  // Tool state
  currentTool: string;
  toolInput: string;
  toolOutput: string;
  toolSettings: Record<string, any>;
  
  // UI state
  theme: 'light' | 'dark' | 'system';
  language: string;
  sidebarOpen: boolean;
  
  // User preferences
  settings: UserSettings;
  history: ToolHistoryEntry[];
}
```

#### 3. **Component Hierarchy**
```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Main
├── Router
│   ├── HomePage
│   ├── ToolPage
│   └── SettingsPage
└── Providers
    ├── ThemeProvider
    ├── I18nProvider
    └── ToolProvider
```

## 🔧 Backend Architecture

### Technology Stack
- **Language**: Go 1.21+
- **Framework**: Gin
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Documentation**: Swagger/OpenAPI
- **Validation**: Go struct tags

### Key Components

#### 1. **HTTP Server Structure**
```
cmd/server/
└── main.go          # Application entry point

internal/
├── handlers/        # HTTP request handlers
├── services/        # Business logic
├── middleware/      # HTTP middleware
├── models/          # Data models
├── database/        # Database operations
└── utils/           # Utility functions
```

#### 2. **API Design**
```go
// RESTful endpoints
POST   /api/tools/{toolId}/process    # Process tool input
GET    /api/tools                     # List all tools
GET    /api/tools/{toolId}            # Get tool details
POST   /api/settings                  # Update user settings
GET    /api/settings                  # Get user settings
GET    /api/health                    # Health check
```

#### 3. **Middleware Stack**
```go
// Middleware order
1. CORS
2. Logging
3. Rate Limiting
4. Authentication (future)
5. Request Validation
6. Response Headers
```

## 🔌 Tool Architecture

### Tool Interface
```typescript
interface Tool {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Tool description
  category: ToolCategory;        // Tool category
  icon: string;                  // Icon identifier
  component?: React.ComponentType<ToolProps>; // Frontend component
  apiEndpoint?: string;          // Backend endpoint
  features: ToolFeature[];       // Available features
}
```

### Tool Implementation Pattern
```typescript
// Frontend: Tool Component
const Base64Tool: React.FC<ToolProps> = ({ input, output, onInputChange, onOutputChange, settings }) => {
  // Tool-specific logic
};

// Backend: Tool Handler
func (h *Handler) ProcessBase64(c *gin.Context) {
  // Tool-specific processing
}
```

## 🗄️ Data Architecture

### Database Schema
```sql
-- Tools table
CREATE TABLE tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    icon TEXT,
    features TEXT, -- JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User settings table
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE,
    settings TEXT, -- JSON object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tool history table
CREATE TABLE tool_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tool_id TEXT NOT NULL,
    input TEXT,
    output TEXT,
    settings TEXT, -- JSON object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Internationalization

### Translation Structure
```
i18n/
├── en/
│   ├── common.json      # Common UI elements
│   ├── tools.json       # Tool-specific translations
│   └── errors.json      # Error messages
├── zh-CN/
│   ├── common.json
│   ├── tools.json
│   └── errors.json
└── ...
```

### Usage Pattern
```typescript
// Frontend
const { t } = useTranslation();
const toolName = t('tools.base64.name');

// Backend
func getLocalizedMessage(key string, lang string) string {
    // Load and return localized message
}
```

## 🔒 Security Architecture

### Security Measures
1. **Input Validation**
   - Frontend: Client-side validation
   - Backend: Server-side validation with Go struct tags

2. **CORS Configuration**
   - Restricted to frontend origin
   - Configurable for different environments

3. **Rate Limiting**
   - Per-IP rate limiting
   - Configurable limits per endpoint

4. **Content Security Policy**
   - Strict CSP headers
   - XSS protection

5. **SQL Injection Prevention**
   - Parameterized queries
   - Input sanitization

## 📈 Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy loading of tool components
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Service Worker for offline support
- **Image Optimization**: WebP format with fallbacks

### Backend Optimization
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis for frequently accessed data
- **Compression**: Gzip compression for responses
- **Async Processing**: Goroutines for concurrent operations

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Tool functionality testing
- **E2E Tests**: Critical user workflows with Playwright

### Backend Testing
- **Unit Tests**: Function testing with Go's testing package
- **Integration Tests**: API endpoint testing
- **Benchmark Tests**: Performance testing for critical functions

## 🚀 Deployment Architecture

### Development Environment
- **Frontend**: Vite dev server (localhost:5173)
- **Backend**: Go dev server (localhost:8080)
- **Database**: SQLite file

### Production Environment
- **Frontend**: Static files served by CDN
- **Backend**: Containerized Go application
- **Database**: PostgreSQL with connection pooling
- **Load Balancer**: Nginx or cloud load balancer

## 📊 Monitoring and Observability

### Metrics
- **Application Metrics**: Request rate, response time, error rate
- **System Metrics**: CPU, memory, disk usage
- **Business Metrics**: Tool usage, user engagement

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: Debug, Info, Warn, Error
- **Log Aggregation**: Centralized log collection

### Health Checks
- **Liveness Probe**: Application health
- **Readiness Probe**: Service readiness
- **Custom Health Checks**: Database connectivity, external services

---

*This architecture is designed to be scalable, maintainable, and easily extensible for future requirements.* 