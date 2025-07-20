import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToolWrapper } from '../ToolWrapper';
import { useAppStore } from '../../store';

const UNICODE_MODES = [
  { value: 'encode', label: 'Encode to \\uXXXX' },
  { value: 'decode', label: 'Decode from \\uXXXX' },
  { value: 'info', label: 'Character Info' },
] as const;

export const UnicodeTool: React.FC = () => {
  const { t } = useTranslation('tools');
  const toolId = 'unicode';
  
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
      toolName={t('unicode.title', 'Unicode Encoder/Decoder')}
      placeholder={{
        input: t('unicode.input.placeholder', 'Enter text to encode or unicode sequences to decode'),
        output: t('unicode.output.placeholder', 'Unicode result or character information will appear here'),
      }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="unicode-mode-select" className="block text-sm font-medium mb-2">
            {t('unicode.mode.label', 'Mode')}
          </label>
          <select
            id="unicode-mode-select"
            value={toolState.settings.mode || 'encode'}
            onChange={handleModeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {UNICODE_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {t(`unicode.mode.${mode.value}`, mode.label)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{t('unicode.description', 'Encode text to Unicode escape sequences, decode sequences back to text, or get detailed character information.')}</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t('unicode.features.encode', 'Convert text to \\uXXXX escape sequences')}</li>
            <li>{t('unicode.features.decode', 'Convert escape sequences back to readable text')}</li>
            <li>{t('unicode.features.info', 'Display Unicode code points and character details')}</li>
          </ul>
        </div>
      </div>
    </ToolWrapper>
  );
}; 