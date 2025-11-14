import { useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import Settings from './components/Settings';
import AIAssistant from './components/AIAssistant';
import ResizablePanels from './components/ResizablePanels';
import DiffViewer from './components/DiffViewer';
import FileManager from './components/FileManager';
import { useEditorStore } from './store/editorStore';
import { LaTeXCompiler } from './services/latexCompiler';

function App() {
  const {
    latexCode,
    setCompilationResult,
    setIsCompiling,
    showSettings,
    editorFullscreen,
    previewFullscreen,
    autoCompile,
    setCompilationError,
    projectFiles,
    addCompilationLog,
  } = useEditorStore();

  // Auto-compile on code change with debounce
  useEffect(() => {
    if (!autoCompile) return; // Skip if manual mode

    const timer = setTimeout(async () => {
      setIsCompiling(true);
      setCompilationError(null); // Clear previous errors
      try {
        const result = await LaTeXCompiler.compile(latexCode, projectFiles);
        setCompilationResult(result);
        setCompilationError(null); // Clear error on success
        addCompilationLog('success', 'Compilation successful');
      } catch (error) {
        console.error('Compilation failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown compilation error';
        setCompilationError(errorMessage);
        setCompilationResult(null); // Clear previous result on error
        addCompilationLog('error', errorMessage);
      } finally {
        setIsCompiling(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [latexCode, projectFiles, setCompilationResult, setIsCompiling, autoCompile, setCompilationError]);

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
          /* Normal Mode - Always 2 panels (File Manager + Editor/Preview) */
          <div className="flex-1 flex">
            {/* Independent File Manager - always available */}
            <FileManager />
            
            {/* Editor and Preview - Two resizable panels */}
            <ResizablePanels
              leftPanel={<Editor />}
              rightPanel={<Preview />}
            />
          </div>
        )}
      </div>
      
      {/* Floating AI Assistant - LinkedIn style */}
      <AIAssistant />
      
      {showSettings && <Settings />}
      <DiffViewer />
    </div>
  );
}

export default App;
