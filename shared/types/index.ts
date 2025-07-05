// Tool-related types
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  component?: React.ComponentType<ToolProps>;
  apiEndpoint?: string;
  features: ToolFeature[];
}

export interface ToolProps {
  input: string;
  output: string;
  onInputChange: (input: string) => void;
  onOutputChange: (output: string) => void;
  settings?: Record<string, any>;
}

export type ToolCategory = 
  | 'encoding'
  | 'formatting'
  | 'protocol'
  | 'text'
  | 'cryptography'
  | 'other';

export type ToolFeature = 
  | 'input-validation'
  | 'output-formatting'
  | 'settings'
  | 'history'
  | 'export'
  | 'import';

// API types
export interface ToolRequest {
  input: string;
  settings?: Record<string, any>;
}

export interface ToolResponse {
  output: string;
  error?: string;
  metadata?: Record<string, any>;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  toolHistory: boolean;
}

// History types
export interface ToolHistoryEntry {
  id: string;
  toolId: string;
  input: string;
  output: string;
  timestamp: number;
  settings?: Record<string, any>;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Internationalization types
export interface Translation {
  [key: string]: string | Translation;
}

export interface I18nConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  fallbackLanguage: string;
} 