import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { FileWarning, Loader2, Maximize2, Minimize2, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function Preview() {
  const { 
    compilationResult, 
    isCompiling, 
    previewFullscreen, 
    setPreviewFullscreen, 
    compilationError,
    compilationLogs 
  } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'logs'>('preview');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Auto-switch to logs tab on error, preview tab on success
  useEffect(() => {
    if (compilationError) {
      setActiveTab('logs');
    } else if (compilationResult?.success) {
      setActiveTab('preview');
    }
  }, [compilationError, compilationResult]);

  useEffect(() => {
    if (compilationResult?.success && compilationResult.pdf) {
      // Create a blob URL for the PDF
      const pdfData = atob(compilationResult.pdf);
      const pdfArray = new Uint8Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i);
      }
      const blob = new Blob([pdfArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setPdfUrl(url);

      // Cleanup old URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [compilationResult]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header with Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-900 rounded p-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Preview
                </div>
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors relative ${
                  activeTab === 'logs'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Logs
                  {compilationError && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              </button>
            </div>
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
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* Preview Tab Content */}
        <div className={`h-full bg-gray-800 ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
          {pdfUrl ? (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          ) : isCompiling ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Compiling...</p>
              </div>
            </div>
          ) : compilationError ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center max-w-md">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Compilation Failed</h3>
                <p className="text-sm text-gray-400 mb-4">Check the Logs tab for details</p>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  View Logs
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileWarning className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No preview available</p>
                <p className="text-xs mt-2">Compile your LaTeX document to see the preview</p>
              </div>
            </div>
          )}
        </div>

        {/* Logs Tab Content */}
        <div className={`h-full bg-gray-900 overflow-y-auto ${activeTab === 'logs' ? 'block' : 'hidden'}`}>
          {/* Logs Tab */}
          <div className="p-4 space-y-2">
              {compilationLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No compilation logs yet</p>
                  <p className="text-xs mt-1">Logs will appear here after compilation</p>
                </div>
              ) : (
                compilationLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      log.type === 'error'
                        ? 'bg-red-900/10 border-red-800/50'
                        : 'bg-green-900/10 border-green-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {log.type === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-sm font-semibold ${
                            log.type === 'error' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {log.type === 'error' ? 'Compilation Error' : 'Compilation Success'}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 break-words whitespace-pre-wrap">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
