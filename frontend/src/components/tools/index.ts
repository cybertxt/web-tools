import React from 'react';
import { Base64Tool } from './Base64Tool';
import { JsonTool } from './JsonTool';
import { UrlTool } from './UrlTool';
import { HtmlTool } from './HtmlTool';
import { UnicodeTool } from './UnicodeTool';

// Tool registry mapping tool IDs to their components
export const toolRegistry: Record<string, React.ComponentType> = {
  'base64': Base64Tool,
  'json': JsonTool,
  'url': UrlTool,
  'html': HtmlTool,
  'unicode': UnicodeTool,
};

// Get a tool component by ID
export const getToolComponent = (toolId: string): React.ComponentType | null => {
  return toolRegistry[toolId] || null;
};

// Get list of available tool IDs
export const getAvailableToolIds = (): string[] => {
  return Object.keys(toolRegistry);
}; 