import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { AIService } from '../services/aiService';
import { AIProviderType, ProviderSettings } from '../types/ai';

export default function Settings() {
  const { setShowSettings, setSelectedProvider } = useEditorStore();
  const aiService = AIService.getInstance();
  const [settings, setSettings] = useState<ProviderSettings>(aiService.getSettings());
  const [activeTab, setActiveTab] = useState<AIProviderType>('gemini');

  const handleSave = () => {
    aiService.saveSettings(settings);
    aiService.setProvider(activeTab);
    setSelectedProvider(activeTab);
    setShowSettings(false);
  };

  const updateProviderSettings = (provider: AIProviderType, key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [key]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">AI Provider Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 px-4">
          {(['gemini', 'ollama', 'openai', 'anthropic'] as AIProviderType[]).map((provider) => (
            <button
              key={provider}
              onClick={() => setActiveTab(provider)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === provider
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'gemini' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.gemini?.apiKey || ''}
                  onChange={(e) => updateProviderSettings('gemini', 'apiKey', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Gemini API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={settings.gemini?.model || 'gemini-pro'}
                  onChange={(e) => updateProviderSettings('gemini', 'model', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gemini-pro">gemini-pro</option>
                  <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                  <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
                    <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                    <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</option>

                </select>
              </div>
              <p className="text-sm text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          )}

          {activeTab === 'ollama' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endpoint URL
                </label>
                <input
                  type="text"
                  value={settings.ollama?.endpoint || 'http://localhost:11434'}
                  onChange={(e) => updateProviderSettings('ollama', 'endpoint', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="http://localhost:11434"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={settings.ollama?.model || 'llama2'}
                  onChange={(e) => updateProviderSettings('ollama', 'model', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="llama2"
                />
              </div>
              <p className="text-sm text-gray-400">
                Install Ollama from{' '}
                <a
                  href="https://ollama.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  ollama.ai
                </a>
              </p>
            </div>
          )}

          {activeTab === 'openai' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.openai?.apiKey || ''}
                  onChange={(e) => updateProviderSettings('openai', 'apiKey', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your OpenAI API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={settings.openai?.model || 'gpt-3.5-turbo'}
                  onChange={(e) => updateProviderSettings('openai', 'model', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                  <option value="gpt-4">gpt-4</option>
                  <option value="gpt-4-turbo">gpt-4-turbo</option>
                </select>
              </div>
              <p className="text-sm text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  OpenAI Platform
                </a>
              </p>
            </div>
          )}

          {activeTab === 'anthropic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.anthropic?.apiKey || ''}
                  onChange={(e) => updateProviderSettings('anthropic', 'apiKey', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Anthropic API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={settings.anthropic?.model || 'claude-3-sonnet-20240229'}
                  onChange={(e) => updateProviderSettings('anthropic', 'model', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="claude-3-sonnet-20240229">claude-3-sonnet</option>
                  <option value="claude-3-opus-20240229">claude-3-opus</option>
                  <option value="claude-3-haiku-20240307">claude-3-haiku</option>
                </select>
              </div>
              <p className="text-sm text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://console.anthropic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Anthropic Console
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-700">
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
