interface ApiError {
  error: string;
  code?: string;
  details?: string;
}

interface ToolRequest {
  input: string;
  settings?: Record<string, any>;
}

interface ToolResponse {
  output: string;
  error?: string;
  metadata?: Record<string, any>;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR',
        };
      }
      throw new Error(errorData.error || 'An error occurred');
    }

    return response.json();
  }

  // Tool-related methods
  async getTools(): Promise<Tool[]> {
    return this.fetch<Tool[]>('/tools');
  }

  async getTool(toolId: string): Promise<Tool> {
    return this.fetch<Tool>(`/tools/${toolId}`);
  }

  async processTool(toolId: string, request: ToolRequest): Promise<ToolResponse> {
    return this.fetch<ToolResponse>(`/tools/${toolId}/process`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Settings-related methods
  async getSettings(): Promise<Record<string, any>> {
    return this.fetch<Record<string, any>>('/settings');
  }

  async updateSettings(settings: Record<string, any>): Promise<{ message: string }> {
    return this.fetch<{ message: string }>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const url = `${this.baseUrl.replace('/api', '')}/health`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type { Tool, ToolRequest, ToolResponse, ApiError }; 