import { memo } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = memo(({ content, className = '' }: MarkdownRendererProps) => {
  // Parse markdown and convert to JSX
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let codeBlock: string[] = [];
    let isCodeBlock = false;
    let codeLanguage = '';
    let listItems: string[] = [];
    let isInList = false;

    const flushCodeBlock = () => {
      if (codeBlock.length > 0) {
        elements.push(
          <pre key={elements.length} className="bg-gray-900 rounded p-3 my-2 overflow-x-auto">
            <code className={`text-sm ${codeLanguage === 'latex' ? 'text-green-300' : 'text-blue-300'}`}>
              {codeBlock.join('\n')}
            </code>
          </pre>
        );
        codeBlock = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside my-2 space-y-1">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm">{parseInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const parseInline = (text: string): (string | JSX.Element)[] => {
      const parts: (string | JSX.Element)[] = [];
      let current = text;
      let key = 0;

      // Bold **text**
      current = current.replace(/\*\*(.+?)\*\*/g, (_, content) => {
        const placeholder = `__BOLD_${key}__`;
        parts.push(<strong key={`bold-${key++}`} className="font-semibold">{content}</strong>);
        return placeholder;
      });

      // Italic *text*
      current = current.replace(/\*(.+?)\*/g, (_, content) => {
        const placeholder = `__ITALIC_${key}__`;
        parts.push(<em key={`italic-${key++}`} className="italic">{content}</em>);
        return placeholder;
      });

      // Inline code `code`
      current = current.replace(/`(.+?)`/g, (_, content) => {
        const placeholder = `__CODE_${key}__`;
        parts.push(
          <code key={`code-${key++}`} className="bg-gray-900 px-1.5 py-0.5 rounded text-blue-300 text-xs">
            {content}
          </code>
        );
        return placeholder;
      });

      // Links [text](url)
      current = current.replace(/\[(.+?)\]\((.+?)\)/g, (_, text, url) => {
        const placeholder = `__LINK_${key}__`;
        parts.push(
          <a key={`link-${key++}`} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
            {text}
          </a>
        );
        return placeholder;
      });

      // Split and reconstruct
      const textParts = current.split(/(__(?:BOLD|ITALIC|CODE|LINK)_\d+__)/);
      return textParts.map((part) => {
        const match = part.match(/__(?:BOLD|ITALIC|CODE|LINK)_(\d+)__/);
        if (match) {
          return parts[parseInt(match[1])];
        }
        return part || null;
      }).filter((item): item is string | JSX.Element => item !== null);
    };

    lines.forEach((line) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (isCodeBlock) {
          flushCodeBlock();
          isCodeBlock = false;
          codeLanguage = '';
        } else {
          flushList();
          isCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        return;
      }

      if (isCodeBlock) {
        codeBlock.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-base font-semibold mt-3 mb-2">
            {parseInline(line.slice(4))}
          </h3>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={elements.length} className="text-lg font-semibold mt-4 mb-2">
            {parseInline(line.slice(3))}
          </h2>
        );
        return;
      }

      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={elements.length} className="text-xl font-bold mt-4 mb-3">
            {parseInline(line.slice(2))}
          </h1>
        );
        return;
      }

      // Lists
      if (line.match(/^[-*]\s/)) {
        if (!isInList) {
          isInList = true;
        }
        listItems.push(line.slice(2));
        return;
      } else if (isInList && line.trim()) {
        // Continue list item
        if (listItems.length > 0) {
          listItems[listItems.length - 1] += ' ' + line.trim();
        }
        return;
      } else if (isInList && !line.trim()) {
        flushList();
        isInList = false;
        return;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s/)) {
        flushList();
        const match = line.match(/^\d+\.\s(.+)/);
        if (match) {
          elements.push(
            <div key={elements.length} className="flex gap-2 my-1">
              <span className="text-gray-400">{line.match(/^\d+/)?.[0]}.</span>
              <span className="text-sm">{parseInline(match[1])}</span>
            </div>
          );
        }
        return;
      }

      // Empty lines
      if (!line.trim()) {
        flushList();
        if (elements.length > 0) {
          elements.push(<div key={elements.length} className="h-2" />);
        }
        return;
      }

      // Regular paragraphs
      flushList();
      elements.push(
        <p key={elements.length} className="text-sm leading-relaxed my-1">
          {parseInline(line)}
        </p>
      );
    });

    flushCodeBlock();
    flushList();

    return elements;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
