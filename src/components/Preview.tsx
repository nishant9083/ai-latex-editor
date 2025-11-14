import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { FileWarning, Loader2, Maximize2, Minimize2 } from 'lucide-react';

export default function Preview() {
  const { compilationResult, isCompiling, previewFullscreen, setPreviewFullscreen, compilationError } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (compilationResult?.success && compilationResult.pdf && iframeRef.current) {
      // Create a blob URL for the PDF
      const pdfData = atob(compilationResult.pdf);
      const pdfArray = new Uint8Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i);
      }
      const blob = new Blob([pdfArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      iframeRef.current.src = url;

      // Cleanup
      return () => URL.revokeObjectURL(url);
    }
  }, [compilationResult]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-300">PDF Preview</h2>
          {isCompiling && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Compiling...</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setPreviewFullscreen(!previewFullscreen)}
          className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          title={previewFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {previewFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="flex-1 bg-gray-800 overflow-auto">
        {compilationError ? (
          <div className="p-4">
            <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <FileWarning className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-2">Compilation Failed</h3>
                <p className="text-sm text-gray-300">{compilationError}</p>
              </div>
            </div>
          </div>
        ) : compilationResult?.success && compilationResult.pdf ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        ) : compilationResult?.errors && compilationResult.errors.length > 0 ? (
          <div className="p-4">
            <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <FileWarning className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold mb-2">LaTeX Compilation Errors</h3>
                <div className="space-y-2">
                  {compilationResult.errors.map((error, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-gray-400">
                        {error.line > 0 ? `Line ${error.line}: ` : ''}
                      </span>
                      <span className="text-gray-300">{error.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isCompiling ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Compiling...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileWarning className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No preview available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
