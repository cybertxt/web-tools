import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToolWrapper } from '../ToolWrapper';
import { useAppStore } from '../../store';

const BASE64_MODES = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
  { value: 'url-encode', label: 'URL-Safe Encode' },
  { value: 'url-decode', label: 'URL-Safe Decode' },
] as const;

export const Base64Tool: React.FC = () => {
  const { t } = useTranslation('tools');
  const toolId = 'base64';
  
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
      toolName={t('base64.title', 'Base64 Encoder/Decoder')}
      placeholder={{
        input: t('base64.input.placeholder', 'Enter text to encode or base64 string to decode'),
        output: t('base64.output.placeholder', 'Encoded/decoded result will appear here'),
      }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="mode-select" className="block text-sm font-medium mb-2">
            {t('base64.mode.label', 'Mode')}
          </label>
          <select
            id="mode-select"
            value={toolState.settings.mode || 'encode'}
            onChange={handleModeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BASE64_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {t(`base64.mode.${mode.value}`, mode.label)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{t('base64.description', 'Base64 is a binary-to-text encoding scheme commonly used to encode binary data for transmission over text-based protocols.')}</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t('base64.features.standard', 'Standard Base64 encoding/decoding')}</li>
            <li>{t('base64.features.urlSafe', 'URL-safe variant (uses - and _ instead of + and /)')}</li>
            <li>{t('base64.features.multiline', 'Handles multiline input')}</li>
          </ul>
        </div>
      </div>
    </ToolWrapper>
  );
}; 