import { Settings as SettingsIcon, Bot, FileText, Layout, Columns, Rows, PanelLeft } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useState, useRef, useEffect } from 'react';

export default function Toolbar() {
  const { 
    setShowSettings, 
    aiPanelOpen, 
    setAiPanelOpen,
    setEditorWidth,
    setAiPanelWidth 
  } = useEditorStore();
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const layoutMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts for layouts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+1 through Alt+5 for layout presets
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            applyLayout('balanced');
            break;
          case '2':
            e.preventDefault();
            applyLayout('editor-focus');
            break;
          case '3':
            e.preventDefault();
            applyLayout('preview-focus');
            break;         
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [aiPanelOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (layoutMenuRef.current && !layoutMenuRef.current.contains(e.target as Node)) {
        setShowLayoutMenu(false);
      }
    };

    if (showLayoutMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLayoutMenu]);

  const applyLayout = (preset: string) => {
    switch (preset) {
      case 'balanced':
        setEditorWidth(50);
        // setAiPanelWidth(30);
        // if (!aiPanelOpen) setAiPanelOpen(true);
        break;
      case 'editor-focus':
        setEditorWidth(70);
        // setAiPanelWidth(25);
        break;
      case 'preview-focus':
        setEditorWidth(30);
        // setAiPanelWidth(25);
        break;
    }
    setShowLayoutMenu(false);
  };

  return (
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-bold text-white">LaTeX AI Editor</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Layout Presets Dropdown */}
        <div className="relative" ref={layoutMenuRef}>
          <button
            onClick={() => setShowLayoutMenu(!showLayoutMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            title="Layout presets"
          >
            <Layout className="w-4 h-4" />
            <span className="text-sm">Layout</span>
          </button>

          {showLayoutMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1">
              <div className="px-3 py-2 text-xs text-gray-400 font-semibold border-b border-gray-700">
                LAYOUT PRESETS
              </div>
              
              <button
                onClick={() => applyLayout('balanced')}
                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
              >
                <Columns className="w-4 h-4" />
                <div className="flex-1">
                  <div className="font-medium">Balanced</div>
                  <div className="text-xs text-gray-500">50% | 50%</div>
                </div>
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-900 border border-gray-600 rounded">Alt+1</kbd>
              </button>

              <button
                onClick={() => applyLayout('editor-focus')}
                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
              >
                <PanelLeft className="w-4 h-4" />
                <div className="flex-1">
                  <div className="font-medium">Editor Focus</div>
                  <div className="text-xs text-gray-500">70% | 30%</div>
                </div>
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-900 border border-gray-600 rounded">Alt+2</kbd>
              </button>

              <button
                onClick={() => applyLayout('preview-focus')}
                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
              >
                <Rows className="w-4 h-4 rotate-90" />
                <div className="flex-1">
                  <div className="font-medium">Preview Focus</div>
                  <div className="text-xs text-gray-500">30% | 70%</div>
                </div>
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-900 border border-gray-600 rounded">Alt+3</kbd>
              </button>
              
            </div>
          )}
        </div>

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
