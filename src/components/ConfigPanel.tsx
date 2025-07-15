import React from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { ScrapingConfig } from '../types/scraper';

interface ConfigPanelProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  config, 
  onConfigChange, 
  isOpen, 
  onToggle 
}) => {
  const updateConfig = (key: keyof ScrapingConfig, value: number | boolean) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-xl"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Scraping Configuration</h3>
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="p-6 pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Retries
                <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" title="Number of retry attempts for failed extractions" />
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={config.maxRetries}
                onChange={(e) => updateConfig('maxRetries', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (seconds)
                <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" title="Request timeout in seconds" />
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={config.timeout}
                onChange={(e) => updateConfig('timeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Limit (requests/second)
              <HelpCircle className="w-4 h-4 text-gray-400 inline ml-1" title="Maximum requests per second to avoid being blocked" />
            </label>
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={config.rateLimit}
              onChange={(e) => updateConfig('rateLimit', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Data Extraction Options</h4>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.extractSocialMedia}
                  onChange={(e) => updateConfig('extractSocialMedia', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Extract social media links</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.extractAddress}
                  onChange={(e) => updateConfig('extractAddress', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Extract physical address</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.extractDescription}
                  onChange={(e) => updateConfig('extractDescription', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Extract company description</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};