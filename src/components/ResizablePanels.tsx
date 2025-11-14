import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export default function ResizablePanels({ leftPanel, rightPanel }: ResizablePanelsProps) {
  const { editorWidth, setEditorWidth } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 80%
      const constrainedWidth = Math.max(20, Math.min(80, newWidth));
      setEditorWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setEditorWidth]);

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
      {/* Left Panel */}
      <div style={{ width: `${editorWidth}%` }} className="border-r border-gray-700">
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className={`w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors ${
          isDragging ? 'bg-blue-500' : ''
        } relative group`}
      >
        {/* Visual indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-8 bg-gray-500 rounded-full group-hover:bg-blue-400 transition-colors" />
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: `${100 - editorWidth}%` }}>
        {rightPanel}
      </div>
    </div>
  );
}
