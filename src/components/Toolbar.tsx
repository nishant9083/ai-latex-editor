import { Settings as SettingsIcon, Bot, FileText } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export default function Toolbar() {
  const { setShowSettings, aiPanelOpen, setAiPanelOpen } = useEditorStore();

  return (
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-bold text-white">LaTeX AI Editor</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            aiPanelOpen
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="text-sm font-medium">AI Assistant</span>
        </button>
        
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          title="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
