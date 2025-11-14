import { Check, X, Eye } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useState } from 'react';

export default function DiffViewer() {
  const { 
    latexCode, 
    suggestedCode, 
    setSuggestedCode, 
    setLatexCode, 
    suggestionPrompt 
  } = useEditorStore();
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  if (!suggestedCode) return null;

  const handleAccept = () => {
    setLatexCode(suggestedCode);
    setSuggestedCode(null);
  };

  const handleReject = () => {
    setSuggestedCode(null);
  };

  // Simple diff calculation (line-based)
  const getDiff = () => {
    const originalLines = latexCode.split('\n');
    const suggestedLines = suggestedCode.split('\n');
    
    const maxLines = Math.max(originalLines.length, suggestedLines.length);
    const diff: Array<{
      type: 'unchanged' | 'added' | 'removed' | 'modified';
      original?: string;
      suggested?: string;
      lineNum: number;
    }> = [];

    for (let i = 0; i < maxLines; i++) {
      const original = originalLines[i];
      const suggested = suggestedLines[i];

      if (original === suggested) {
        diff.push({ type: 'unchanged', original, lineNum: i + 1 });
      } else if (original && suggested) {
        diff.push({ type: 'modified', original, suggested, lineNum: i + 1 });
      } else if (original) {
        diff.push({ type: 'removed', original, lineNum: i + 1 });
      } else if (suggested) {
        diff.push({ type: 'added', suggested, lineNum: i + 1 });
      }
    }

    return diff;
  };

  const diff = getDiff();
  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    modified: diff.filter(d => d.type === 'modified').length,
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">AI Code Suggestion</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'split' ? 'unified' : 'split')}
                className="px-3 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                {viewMode === 'split' ? 'Unified' : 'Split'} View
              </button>
            </div>
          </div>
          {suggestionPrompt && (
            <p className="text-sm text-gray-400 mb-3">{suggestionPrompt}</p>
          )}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-green-400">+{stats.added} additions</span>
            <span className="text-red-400">-{stats.removed} deletions</span>
            {stats.modified > 0 && (
              <span className="text-yellow-400">~{stats.modified} modifications</span>
            )}
          </div>
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'split' ? (
            <div className="grid grid-cols-2 divide-x divide-gray-700">
              {/* Original */}
              <div className="bg-gray-900">
                <div className="sticky top-0 px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs font-semibold text-gray-300">
                  Current Code
                </div>
                <div className="font-mono text-xs">
                  {diff.map((line, idx) => (
                    line.type !== 'added' && (
                      <div
                        key={idx}
                        className={`px-4 py-1 ${
                          line.type === 'removed' ? 'bg-red-900/30 text-red-300' :
                          line.type === 'modified' ? 'bg-yellow-900/20 text-yellow-300' :
                          'text-gray-400'
                        }`}
                      >
                        <span className="inline-block w-8 text-gray-600 select-none">
                          {line.lineNum}
                        </span>
                        {line.type === 'removed' && <span className="text-red-500 mr-1">-</span>}
                        {line.original || ' '}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Suggested */}
              <div className="bg-gray-900">
                <div className="sticky top-0 px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs font-semibold text-gray-300">
                  Suggested Code
                </div>
                <div className="font-mono text-xs">
                  {diff.map((line, idx) => (
                    line.type !== 'removed' && (
                      <div
                        key={idx}
                        className={`px-4 py-1 ${
                          line.type === 'added' ? 'bg-green-900/30 text-green-300' :
                          line.type === 'modified' ? 'bg-yellow-900/20 text-yellow-300' :
                          'text-gray-400'
                        }`}
                      >
                        <span className="inline-block w-8 text-gray-600 select-none">
                          {line.lineNum}
                        </span>
                        {line.type === 'added' && <span className="text-green-500 mr-1">+</span>}
                        {line.suggested || line.original || ' '}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Unified View */
            <div className="bg-gray-900">
              <div className="sticky top-0 px-4 py-2 bg-gray-800 border-b border-gray-700 text-xs font-semibold text-gray-300">
                Unified Diff
              </div>
              <div className="font-mono text-xs">
                {diff.map((line, idx) => (
                  <div key={idx}>
                    {line.type === 'modified' ? (
                      <>
                        <div className="px-4 py-1 bg-red-900/30 text-red-300">
                          <span className="inline-block w-8 text-gray-600 select-none">
                            {line.lineNum}
                          </span>
                          <span className="text-red-500 mr-1">-</span>
                          {line.original}
                        </div>
                        <div className="px-4 py-1 bg-green-900/30 text-green-300">
                          <span className="inline-block w-8 text-gray-600 select-none">
                            {line.lineNum}
                          </span>
                          <span className="text-green-500 mr-1">+</span>
                          {line.suggested}
                        </div>
                      </>
                    ) : (
                      <div
                        className={`px-4 py-1 ${
                          line.type === 'added' ? 'bg-green-900/30 text-green-300' :
                          line.type === 'removed' ? 'bg-red-900/30 text-red-300' :
                          'text-gray-400'
                        }`}
                      >
                        <span className="inline-block w-8 text-gray-600 select-none">
                          {line.lineNum}
                        </span>
                        {line.type === 'added' && <span className="text-green-500 mr-1">+</span>}
                        {line.type === 'removed' && <span className="text-red-500 mr-1">-</span>}
                        {line.type === 'unchanged' && <span className="mr-2"> </span>}
                        {line.suggested || line.original || ' '}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-end gap-3">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept Changes
          </button>
        </div>
      </div>
    </div>
  );
}
