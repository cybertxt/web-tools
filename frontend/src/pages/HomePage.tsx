import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useTools } from '../store';

export const HomePage: React.FC = () => {
  const { tools, loading, loadTools } = useTools();

  useEffect(() => {
    if (tools.length === 0 && !loading) {
      loadTools();
    }
  }, [tools.length, loading, loadTools]);

  const featuredTools = tools.slice(0, 5); // Show first 5 tools

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Hero Section */}
      <div className="flex flex-col items-center space-y-6 text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
          Developer Tools
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
          Simple, fast, and secure online tools for developers. All processing happens in your browser.
        </p>
        <div className="flex gap-4">
          <Link to="/tools">
            <Button size="lg" className="px-8">
              Browse All Tools
            </Button>
          </Link>
        </div>
      </div>

      {/* Tools Grid */}
      {featuredTools.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {featuredTools.map((tool) => (
            <Card key={tool.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{getToolIcon(tool.category)}</span>
                  {tool.name}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={`/tools/${tool.id}`}>
                  <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-300">
                    Use Tool
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Simple Features */}
      <div className="mt-20 text-center">
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="space-y-2">
            <div className="text-3xl">⚡</div>
            <h3 className="font-semibold">Fast Processing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Instant results with client-side processing
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🔒</div>
            <h3 className="font-semibold">Private & Secure</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your data never leaves your browser
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🎯</div>
            <h3 className="font-semibold">Simple to Use</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clean interface, no registration required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get icon for tool category
function getToolIcon(category: string): string {
  switch (category.toLowerCase()) {
    case 'encoding':
      return '🔤';
    case 'formatting':
      return '📝';
    case 'cryptography':
      return '🔐';
    default:
      return '🛠️';
  }
} 