import { useState, useRef, useEffect } from 'react';
import { Send, Wand2, Bug, Wrench, Loader2, Bot } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { AIService } from '../services/aiService';
import { AIMessage } from '../types/ai';
import MarkdownRenderer from './MarkdownRenderer';

export default function AIAssistant() {
  const { latexCode, setLatexCode, aiMessages, addAiMessage, aiLoading, setAiLoading, selectedProvider } = useEditorStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = AIService.getInstance();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    setInput('');
    addAiMessage('user', prompt);
    setAiLoading(true);

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
      addAiMessage('assistant', response.content);
    } catch (error: any) {
      addAiMessage('assistant', `Error: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleWrite = () => {
    const prompt = `Based on this LaTeX code, help me write:\n\n\`\`\`latex\n${latexCode}\n\`\`\`\n\n${input}`;
    sendMessage(prompt);
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

      setLatexCode(fixedCode.trim());
      addAiMessage('assistant', 'Code has been fixed and updated in the editor.');
    } catch (error: any) {
      addAiMessage('assistant', `Error: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">AI Assistant</h2>
        {!selectedProvider && (
          <p className="text-xs text-yellow-400 mt-1">⚠️ Configure AI provider in settings</p>
        )}
      </div>

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
        <div className="flex gap-2">
          <button
            onClick={handleDebug}
            disabled={aiLoading || !selectedProvider}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Bug className="w-4 h-4" />
            Debug
          </button>
          <button
            onClick={handleFix}
            disabled={aiLoading || !selectedProvider}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Wrench className="w-4 h-4" />
            Fix
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !aiLoading && handleWrite()}
            placeholder="Ask AI to help write..."
            disabled={aiLoading || !selectedProvider}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
          />
          <button
            onClick={handleWrite}
            disabled={aiLoading || !input.trim() || !selectedProvider}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => sendMessage(input)}
            disabled={aiLoading || !input.trim() || !selectedProvider}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
