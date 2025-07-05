# Web Tools Platform - Frontend

The frontend for the Web Tools Platform built with React, TypeScript, and Vite.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **React i18next** - Internationalization
- **Vitest** - Testing
- **ESLint** - Linting
- **Prettier** - Code formatting

## 🎨 Design System

The frontend uses a custom design system built with Tailwind CSS:

- **Colors**: Primary (Blue), Secondary (Purple), Success (Green), Warning (Yellow), Error (Red)
- **Typography**: Inter for UI, JetBrains Mono for code
- **Components**: Consistent button, input, card, and form components
- **Dark Mode**: Full dark mode support

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Web Tools Platform
VITE_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── tools/              # Individual tool implementations
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── i18n/               # Internationalization
├── styles/             # Global styles
└── test/               # Test utilities
```

## 🧪 Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## 🔧 Development

### Code Quality

- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Strict mode enabled
- **Husky**: Git hooks for pre-commit checks

### Path Aliases

- `@/*` - Maps to `src/*`
- `@shared/*` - Maps to `../shared/*`

### Build Optimization

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Bundle Analysis**: Chunk optimization for better caching
- **Asset Optimization**: Image and font optimization 