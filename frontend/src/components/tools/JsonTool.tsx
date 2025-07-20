import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToolWrapper } from '../ToolWrapper';
import { useAppStore } from '../../store';

const JSON_MODES = [
  { value: 'format', label: 'Format/Prettify' },
  { value: 'minify', label: 'Minify' },
  { value: 'validate', label: 'Validate Only' },
] as const;

export const JsonTool: React.FC = () => {
  const { t } = useTranslation('tools');
  const toolId = 'json';
  
  const toolState = useAppStore((state) => state.toolStates[toolId] || {
    input: '',
    output: '',
    processing: false,
    error: null,
    settings: { mode: 'format' },
  });
  
  const { updateToolSettings } = useAppStore();

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateToolSettings(toolId, { mode: e.target.value });
  };

  return (
    <ToolWrapper
      toolId={toolId}
      toolName={t('json.title', 'JSON Formatter/Validator')}
      placeholder={{
        input: t('json.input.placeholder', 'Enter JSON data to format, minify, or validate'),
        output: t('json.output.placeholder', 'Formatted/minified JSON will appear here'),
      }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="json-mode-select" className="block text-sm font-medium mb-2">
            {t('json.mode.label', 'Mode')}
          </label>
          <select
            id="json-mode-select"
            value={toolState.settings.mode || 'format'}
            onChange={handleModeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {JSON_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {t(`json.mode.${mode.value}`, mode.label)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{t('json.description', 'Format, validate, and minify JSON data. Supports nested objects and arrays.')}</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t('json.features.format', 'Pretty-print with proper indentation')}</li>
            <li>{t('json.features.minify', 'Remove whitespace to minimize size')}</li>
            <li>{t('json.features.validate', 'Validate JSON syntax and structure')}</li>
            <li>{t('json.features.error', 'Clear error messages for invalid JSON')}</li>
          </ul>
        </div>
      </div>
    </ToolWrapper>
  );
}; 