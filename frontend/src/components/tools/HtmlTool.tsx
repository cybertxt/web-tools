import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToolWrapper } from '../ToolWrapper';
import { useAppStore } from '../../store';

const HTML_MODES = [
  { value: 'encode', label: 'Encode (Escape)' },
  { value: 'decode', label: 'Decode (Unescape)' },
] as const;

export const HtmlTool: React.FC = () => {
  const { t } = useTranslation('tools');
  const toolId = 'html';
  
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
      toolName={t('html.title', 'HTML Encoder/Decoder')}
      placeholder={{
        input: t('html.input.placeholder', 'Enter HTML to escape or escaped HTML to decode'),
        output: t('html.output.placeholder', 'Escaped/unescaped HTML will appear here'),
      }}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="html-mode-select" className="block text-sm font-medium mb-2">
            {t('html.mode.label', 'Mode')}
          </label>
          <select
            id="html-mode-select"
            value={toolState.settings.mode || 'encode'}
            onChange={handleModeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {HTML_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {t(`html.mode.${mode.value}`, mode.label)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{t('html.description', 'Escape and unescape HTML entities to safely display HTML content or render it properly.')}</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t('html.features.entities', 'Converts characters to HTML entities (&lt;, &gt;, &amp;, etc.)')}</li>
            <li>{t('html.features.safe', 'Prevents XSS attacks by escaping dangerous characters')}</li>
            <li>{t('html.features.decode', 'Converts HTML entities back to readable text')}</li>
          </ul>
        </div>
      </div>
    </ToolWrapper>
  );
}; 