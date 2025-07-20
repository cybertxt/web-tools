import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToolWrapper } from '../ToolWrapper';
import { useAppStore } from '../../store';

const URL_MODES = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
  { value: 'encode-component', label: 'Encode Component' },
  { value: 'decode-component', label: 'Decode Component' },
] as const;

export const UrlTool: React.FC = () => {
  const { t } = useTranslation('tools');
  const toolId = 'url';
  
  const toolState = useAppStore((state) => state.toolStates[toolId] || {
    input: '',
    output: '',
    processing: false,
    error: null,
    settings: { mode: 'encode' },
  });
  
  const { updateToolSettings } = useAppStore();

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateToolSettings(toolId, { mode: e.target.value });
  };

  return (
    <ToolWrapper
      toolId={toolId}
      toolName={t('url.title', 'URL Encoder/Decoder')}
      placeholder={{
        input: t('url.input.placeholder', 'Enter text to URL encode or URL-encoded string to decode'),
        output: t('url.output.placeholder', 'Encoded/decoded URL will appear here'),
      }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="url-mode-select" className="block text-sm font-medium mb-2">
            {t('url.mode.label', 'Mode')}
          </label>
          <select
            id="url-mode-select"
            value={toolState.settings.mode || 'encode'}
            onChange={handleModeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {URL_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {t(`url.mode.${mode.value}`, mode.label)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{t('url.description', 'Encode and decode URL parameters and components for safe transmission over HTTP.')}</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t('url.features.query', 'URL query parameter encoding/decoding')}</li>
            <li>{t('url.features.component', 'URL path component encoding/decoding')}</li>
            <li>{t('url.features.safe', 'Handles special characters and spaces')}</li>
          </ul>
        </div>
      </div>
    </ToolWrapper>
  );
}; 