import { useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import Settings from './components/Settings';
import AIAssistant from './components/AIAssistant';
import ResizablePanels from './components/ResizablePanels';
import { useEditorStore } from './store/editorStore';
import { LaTeXCompiler } from './services/latexCompiler';

function App() {
  const {
    latexCode,
    setCompilationResult,
    setIsCompiling,
    showSettings,
    aiPanelOpen,
    editorFullscreen,
    previewFullscreen,
    autoCompile,
    setCompilationError,
  } = useEditorStore();

  // Auto-compile on code change with debounce
  useEffect(() => {
    if (!autoCompile) return; // Skip if manual mode

    const timer = setTimeout(async () => {
      setIsCompiling(true);
      setCompilationError(null); // Clear previous errors
      try {
        const result = await LaTeXCompiler.compile(latexCode);
        setCompilationResult(result);
        setCompilationError(null); // Clear error on success
      } catch (error) {
        console.error('Compilation failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown compilation error';
        setCompilationError(errorMessage);
        setCompilationResult(null); // Clear previous result on error
      } finally {
        setIsCompiling(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [latexCode, setCompilationResult, setIsCompiling, autoCompile, setCompilationError]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Fullscreen Mode */}
        {editorFullscreen && !previewFullscreen ? (
          <div className="flex-1">
            <Editor />
          </div>
        ) : previewFullscreen && !editorFullscreen ? (
          /* Preview Fullscreen Mode */
          <div className="flex-1">
            <Preview />
          </div>
        ) : (
          /* Normal Mode with Resizable Panels */
          <div className="flex-1 flex">
            {aiPanelOpen ? (
              /* With AI Panel */
              <>
                <div className="w-1/3 border-r border-gray-700">
                  <Editor />
                </div>
                <div className="w-1/3 border-r border-gray-700">
                  <Preview />
                </div>
                <div className="w-1/3">
                  <AIAssistant />
                </div>
              </>
            ) : (
              /* Without AI Panel - Resizable */
              <ResizablePanels
                leftPanel={<Editor />}
                rightPanel={<Preview />}
              />
            )}
          </div>
        )}
      </div>
      {showSettings && <Settings />}
    </div>
  );
}

export default App;
