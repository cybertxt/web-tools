import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getToolComponent } from '../components/tools';
import { useAppStore } from '../store';

export const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { setCurrentTool } = useAppStore();

  useEffect(() => {
    if (toolId) {
      setCurrentTool(toolId);
    }
    return () => {
      setCurrentTool(null);
    };
  }, [toolId, setCurrentTool]);

  if (!toolId) {
    return <Navigate to="/tools" replace />;
  }

  const ToolComponent = getToolComponent(toolId);

  if (!ToolComponent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tool Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The tool "{toolId}" is not available or hasn't been implemented yet.
          </p>
          <a 
            href="/tools"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Tools
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToolComponent />
    </div>
  );
}; 