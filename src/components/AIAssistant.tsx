import { useState, useRef, useEffect } from 'react';
import { Send, Wand2, Bug, Wrench, Loader2, Bot, Square, X, Minimize2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { AIService } from '../services/aiService';
import { AIMessage } from '../types/ai';
import MarkdownRenderer from './MarkdownRenderer';

export default function AIAssistant() {
  const { 
    latexCode, 
    aiMessages, 
    addAiMessage, 
    aiLoading, 
    setAiLoading, 
    selectedProvider,
    setSuggestedCode,
    setSuggestionPrompt,
    aiPanelOpen,
    setAiPanelOpen,
  } = useEditorStore();
  const [input, setInput] = useState('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const aiService = AIService.getInstance();

  // Initialize position to bottom-right
  useEffect(() => {
    if (containerRef.current && position.x === 0 && position.y === 0) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width ,
        y: window.innerHeight - rect.height
      });
    }
  }, [aiPanelOpen, isMinimized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to window bounds
      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 400);
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 600);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
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
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setAiLoading(false);
      addAiMessage('assistant', '[Generation stopped by user]');
    }
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    setInput('');
    addAiMessage('user', prompt);
    setAiLoading(true);
    
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const provider = aiService.getProvider();
      if (!provider) {
        throw new Error('Please configure an AI provider in settings');
      }

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: 'You are an expert LaTeX assistant. Help users write, debug, and fix LaTeX code. Provide clear, concise responses with code examples when appropriate.',
        },
        ...aiMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: prompt },
      ];

      const response = await provider.chat(messages);
      if (!controller.signal.aborted) {
        addAiMessage('assistant', response.content);
      }
    } catch (error: any) {
      if (!controller.signal.aborted) {
        addAiMessage('assistant', `Error: ${error.message}`);
      }
    } finally {
      setAiLoading(false);
      setAbortController(null);
    }
  };

  const handleWrite = async () => {
    if (!input.trim()) {
      addAiMessage('assistant', 'Please describe what you want to add to your LaTeX document.');
      return;
    }

    const prompt = `Add the following to this LaTeX code: "${input}"\n\nCurrent code:\n\`\`\`latex\n${latexCode}\n\`\`\`\n\nProvide the complete updated LaTeX code with the additions.`;
    
    const userRequest = input;
    setInput('');
    addAiMessage('user', `Add: ${userRequest}`);
    setAiLoading(true);

    try {
      const provider = aiService.getProvider();
      if (!provider) {
        throw new Error('Please configure an AI provider in settings');
      }

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: 'You are an expert LaTeX assistant. When asked to add content, provide the complete updated LaTeX code without explanations or markdown formatting.',
        },
        { role: 'user', content: prompt },
      ];

      const response = await provider.chat(messages);
      
      // Extract LaTeX code from response
      let newCode = response.content;
      const codeMatch = newCode.match(/```(?:latex)?\n([\s\S]*?)\n```/);
      if (codeMatch) {
        newCode = codeMatch[1];
      }

      // Show diff
      setSuggestedCode(newCode.trim());
      setSuggestionPrompt(`AI additions: ${userRequest}`);
      addAiMessage('assistant', 'Review the suggested additions in the diff viewer.');
    } catch (error: any) {
      addAiMessage('assistant', `Error: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDebug = async () => {
    const prompt = `Debug this LaTeX code and explain any errors or potential issues:\n\n\`\`\`latex\n${latexCode}\n\`\`\``;
    sendMessage(prompt);
  };

  const handleFix = async () => {
    const prompt = `Fix any errors in this LaTeX code and provide the corrected version:\n\n\`\`\`latex\n${latexCode}\n\`\`\`\n\nProvide only the corrected LaTeX code without explanations.`;
    
    setInput('');
    addAiMessage('user', 'Fix the LaTeX code');
    setAiLoading(true);

    try {
      const provider = aiService.getProvider();
      if (!provider) {
        throw new Error('Please configure an AI provider in settings');
      }

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: 'You are an expert LaTeX assistant. When asked to fix code, provide only the corrected LaTeX code without explanations or markdown formatting.',
        },
        { role: 'user', content: prompt },
      ];

      const response = await provider.chat(messages);
      
      // Extract LaTeX code from response (in case it's wrapped in markdown)
      let fixedCode = response.content;
      const codeMatch = fixedCode.match(/```(?:latex)?\n([\s\S]*?)\n```/);
      if (codeMatch) {
        fixedCode = codeMatch[1];
      }

      // Show diff instead of directly applying
      setSuggestedCode(fixedCode.trim());
      setSuggestionPrompt('AI suggested fixes for your LaTeX code');
      addAiMessage('assistant', 'Review the suggested changes in the diff viewer.');
    } catch (error: any) {
      addAiMessage('assistant', `Error: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!input.trim()) {
      addAiMessage('assistant', 'Please describe what you want to improve.');
      return;
    }

    const prompt = `Improve this LaTeX code based on the request: "${input}"\n\nCurrent code:\n\`\`\`latex\n${latexCode}\n\`\`\`\n\nProvide only the improved LaTeX code without explanations.`;
    
    const userRequest = input;
    setInput('');
    addAiMessage('user', `Improve: ${userRequest}`);
    setAiLoading(true);

    try {
      const provider = aiService.getProvider();
      if (!provider) {
        throw new Error('Please configure an AI provider in settings');
      }

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: 'You are an expert LaTeX assistant. When asked to improve code, provide only the improved LaTeX code without explanations or markdown formatting.',
        },
        { role: 'user', content: prompt },
      ];

      const response = await provider.chat(messages);
      
      // Extract LaTeX code from response
      let improvedCode = response.content;
      const codeMatch = improvedCode.match(/```(?:latex)?\n([\s\S]*?)\n```/);
      if (codeMatch) {
        improvedCode = codeMatch[1];
      }

      // Show diff
      setSuggestedCode(improvedCode.trim());
      setSuggestionPrompt(`AI improvements: ${userRequest}`);
      addAiMessage('assistant', 'Review the suggested improvements in the diff viewer.');
    } catch (error: any) {
      addAiMessage('assistant', `Error: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // If minimized, show compact button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span className="font-medium">AI Assistant</span>
          {aiMessages.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {aiMessages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  // If closed, don't show anything
  if (!aiPanelOpen) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed w-[450px] h-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header - Draggable */}
      <div 
        className="px-4 py-3 bg-gray-800 border-b border-gray-700 rounded-t-lg flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-semibold text-gray-300">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAiPanelOpen(false);
            }}
            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!selectedProvider && (
        <div className="px-4 py-2 bg-yellow-900/20 border-b border-yellow-800/50">
          <p className="text-xs text-yellow-400">⚠️ Configure AI provider in settings</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aiMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Ask me to help with your LaTeX code!</p>
            <div className="mt-4 space-y-2 text-xs">
              <p>Try: "Add a table of contents"</p>
              <p>Or click Debug/Fix buttons</p>
            </div>
          </div>
        ) : (
          aiMessages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>
            </div>
          ))
        )}
        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleDebug}
            disabled={aiLoading || !selectedProvider}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Bug className="w-4 h-4" />
            Debug
          </button>
          <button
            onClick={handleFix}
            disabled={aiLoading || !selectedProvider}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Wrench className="w-4 h-4" />
            Fix
          </button>
          <button
            onClick={handleImprove}
            disabled={aiLoading || !selectedProvider || !input.trim()}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Wand2 className="w-4 h-4" />
            Improve
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!aiLoading && input.trim()) {
                  sendMessage(input);
                }
              }
            }}
            placeholder="Describe what to add/improve..."
            disabled={aiLoading || !selectedProvider}
            rows={1}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm resize-none overflow-y-auto"
            style={{ minHeight: '40px', maxHeight: '150px' }}
          />
          {aiLoading ? (
            <button
              onClick={handleStopGeneration}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex-shrink-0"
              title="Stop generation"
            >
              <Square className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={handleWrite}
                disabled={aiLoading || !input.trim() || !selectedProvider}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title="Add content with diff preview"
              >
                <Wand2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={aiLoading || !input.trim() || !selectedProvider}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title="Chat with AI (Enter to send)"
              >
                <Send className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
