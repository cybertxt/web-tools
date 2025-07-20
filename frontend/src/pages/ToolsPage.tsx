import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTools } from '../store';
import { getAvailableToolIds } from '../components/tools';

export const ToolsPage: React.FC = () => {
  const { t } = useTranslation();
  const { tools, loading, error, loadTools } = useTools();

  useEffect(() => {
    if (tools.length === 0 && !loading) {
      loadTools();
    }
  }, [tools.length, loading, loadTools]);

  const availableToolIds = getAvailableToolIds();
  const implementedTools = tools.filter(tool => availableToolIds.includes(tool.id));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tools</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={loadTools}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {t('navigation.tools', 'Developer Tools')}
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Choose from our collection of developer tools to help with your daily tasks.
        </p>
      </div>

      {implementedTools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No tools are currently available.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {implementedTools.map((tool) => (
            <Card key={tool.id} className="relative group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {tool.category}
                  </div>
                </div>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tool.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tool.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {feature}
                        </span>
                      ))}
                      {tool.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          +{tool.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <Link to={`/tools/${tool.id}`}>
                    <Button className="w-full">
                      Use Tool
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tools.length > implementedTools.length && (
        <div className="mt-12 text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              {tools.length - implementedTools.length} tools are available in the backend but not yet implemented in the frontend.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 