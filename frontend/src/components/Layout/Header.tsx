import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

interface HeaderProps {
  onThemeToggle: () => void;
  currentTheme: 'light' | 'dark' | 'system';
}

export const Header: React.FC<HeaderProps> = ({ onThemeToggle, currentTheme }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🛠️</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Developer Tools
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive('/') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/tools"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive('/tools') || location.pathname.startsWith('/tools/')
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Tools
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive('/about') 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Theme toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            className="h-9 w-9 p-0"
          >
            {currentTheme === 'light' ? '🌙' : currentTheme === 'dark' ? '☀️' : '🌓'}
          </Button>
        </div>
      </div>
    </header>
  );
}; 