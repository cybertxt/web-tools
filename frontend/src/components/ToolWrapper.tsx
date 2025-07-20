import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Textarea } from './ui/Input';
import { useAppStore } from '../store';

interface ToolWrapperProps {
  toolId: string;
  toolName: string;
  children?: React.ReactNode; // For tool-specific settings
  placeholder?: {
    input?: string;
    output?: string;
  };
}

export const ToolWrapper: React.FC<ToolWrapperProps> = ({
  toolId,
  toolName,
  children,
  placeholder = {},
}) => {
  const { t } = useTranslation('tools');
  
  const toolState = useAppStore((state) => state.toolStates[toolId] || {
    input: '',
    output: '',
    processing: false,
    error: null,
    settings: {},
  });
  
  const { updateToolInput, processTool, clearToolState } = useAppStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateToolInput(toolId, e.target.value);
  };

  const handleProcess = () => {
    processTool(toolId);
  };

  const handleClear = () => {
    clearToolState(toolId);
  };

  const handleCopyOutput = async () => {
    if (toolState.output) {
      try {
        await navigator.clipboard.writeText(toolState.output);
        // TODO: Add toast notification
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {toolName}
        </h1>
      </div>

      {/* Tool-specific settings */}
      {children && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.title', 'Settings')}</CardTitle>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('input.title', 'Input')}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!toolState.input && !toolState.output}
              >
                {t('actions.clear', 'Clear')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={toolState.input}
                onChange={handleInputChange}
                placeholder={placeholder.input || t('input.placeholder', 'Enter your text here...')}
                className="min-h-[200px] font-mono"
                disabled={toolState.processing}
              />
              <Button
                onClick={handleProcess}
                loading={toolState.processing}
                disabled={!toolState.input.trim()}
                className="w-full"
              >
                {toolState.processing 
                  ? t('actions.processing', 'Processing...') 
                  : t('actions.process', 'Process')
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('output.title', 'Output')}
              {toolState.output && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyOutput}
                >
                  {t('actions.copy', 'Copy')}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={toolState.error || toolState.output}
                readOnly
                placeholder={placeholder.output || t('output.placeholder', 'Output will appear here...')}
                className={`min-h-[200px] font-mono ${
                  toolState.error 
                    ? 'text-red-600 border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800' 
                    : ''
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 