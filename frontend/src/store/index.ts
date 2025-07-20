import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, type Tool } from '../utils/api';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'sm' | 'md' | 'lg';
  autoSave: boolean;
  toolHistory: boolean;
}

interface ToolState {
  input: string;
  output: string;
  processing: boolean;
  error: string | null;
  settings: Record<string, any>;
}

interface AppState {
  // Tools
  tools: Tool[];
  loadingTools: boolean;
  toolsError: string | null;
  
  // Current tool state
  currentTool: string | null;
  toolStates: Record<string, ToolState>;
  
  // App settings
  settings: AppSettings;
  
  // Actions
  loadTools: () => Promise<void>;
  setCurrentTool: (toolId: string | null) => void;
  updateToolInput: (toolId: string, input: string) => void;
  updateToolSettings: (toolId: string, settings: Record<string, any>) => void;
  processTool: (toolId: string) => Promise<void>;
  clearToolState: (toolId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  saveSettings: () => Promise<void>;
}

const defaultToolState: ToolState = {
  input: '',
  output: '',
  processing: false,
  error: null,
  settings: {},
};

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  fontSize: 'md',
  autoSave: true,
  toolHistory: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      tools: [],
      loadingTools: false,
      toolsError: null,
      currentTool: null,
      toolStates: {},
      settings: defaultSettings,

      // Actions
      loadTools: async () => {
        set({ loadingTools: true, toolsError: null });
        try {
          const tools = await apiClient.getTools();
          set({ tools, loadingTools: false });
        } catch (error) {
          set({ 
            toolsError: error instanceof Error ? error.message : 'Failed to load tools',
            loadingTools: false 
          });
        }
      },

      setCurrentTool: (toolId) => {
        set({ currentTool: toolId });
        // Initialize tool state if it doesn't exist
        if (toolId && !get().toolStates[toolId]) {
          set((state) => ({
            toolStates: {
              ...state.toolStates,
              [toolId]: { ...defaultToolState },
            },
          }));
        }
      },

      updateToolInput: (toolId, input) => {
        set((state) => ({
          toolStates: {
            ...state.toolStates,
            [toolId]: {
              ...state.toolStates[toolId] || defaultToolState,
              input,
              error: null, // Clear error when input changes
            },
          },
        }));
      },

      updateToolSettings: (toolId, settings) => {
        set((state) => ({
          toolStates: {
            ...state.toolStates,
            [toolId]: {
              ...state.toolStates[toolId] || defaultToolState,
              settings,
            },
          },
        }));
      },

      processTool: async (toolId) => {
        const { toolStates } = get();
        const toolState = toolStates[toolId];
        
        if (!toolState) return;

        set((state) => ({
          toolStates: {
            ...state.toolStates,
            [toolId]: {
              ...toolState,
              processing: true,
              error: null,
            },
          },
        }));

        try {
          const response = await apiClient.processTool(toolId, {
            input: toolState.input,
            settings: toolState.settings,
          });

          set((state) => ({
            toolStates: {
              ...state.toolStates,
              [toolId]: {
                ...state.toolStates[toolId],
                output: response.output,
                processing: false,
                error: response.error || null,
              },
            },
          }));
        } catch (error) {
          set((state) => ({
            toolStates: {
              ...state.toolStates,
              [toolId]: {
                ...state.toolStates[toolId],
                processing: false,
                error: error instanceof Error ? error.message : 'Processing failed',
              },
            },
          }));
        }
      },

      clearToolState: (toolId) => {
        set((state) => ({
          toolStates: {
            ...state.toolStates,
            [toolId]: { ...defaultToolState },
          },
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      saveSettings: async () => {
        try {
          const { settings } = get();
          await apiClient.updateSettings(settings);
        } catch (error) {
          console.error('Failed to save settings:', error);
        }
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        settings: state.settings,
        toolStates: state.toolStates,
      }),
    }
  )
);

// Convenience hooks for specific parts of the store
export const useTools = () => useAppStore((state) => ({
  tools: state.tools,
  loading: state.loadingTools,
  error: state.toolsError,
  loadTools: state.loadTools,
}));

export const useCurrentTool = () => useAppStore((state) => ({
  currentTool: state.currentTool,
  setCurrentTool: state.setCurrentTool,
  toolState: state.currentTool ? state.toolStates[state.currentTool] : null,
}));

export const useSettings = () => useAppStore((state) => ({
  settings: state.settings,
  updateSettings: state.updateSettings,
  saveSettings: state.saveSettings,
})); 