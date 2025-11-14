import Editor, { OnMount } from '@monaco-editor/react';
import { Maximize2, Minimize2, Search, FileText, Download, Copy, Undo, Redo, Type, Play, Square, Zap, Check } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useRef, useState, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import { LaTeXCompiler } from '../services/latexCompiler';

export default function CodeEditor() {
    const {
        latexCode,
        setLatexCode,
        editorFullscreen,
        setEditorFullscreen,
        autoCompile,
        setAutoCompile,
        isCompiling,
        setIsCompiling,
        setCompilationResult,
        setCompilationError,
        fontSize,
        showMinimap,
        showLineNumbers,
        currentFile,
        projectFiles,
        updateProjectFile,
        addCompilationLog,
    } = useEditorStore();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [showStats, setShowStats] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const compilationAbortController = useRef<AbortController | null>(null);

    // Get current file content
    const currentFileContent = currentFile === 'main.tex'
        ? latexCode
        : (projectFiles.find(f => f.name === currentFile)?.content || '');

    // Update file content when editor changes
    const handleContentChange = (value: string | undefined) => {
        if (value === undefined) return;

        if (currentFile === 'main.tex') {
            setLatexCode(value);
        } else {
            updateProjectFile(currentFile, value);
        }
    };

    // Show "Saved" indicator when content changes
    useEffect(() => {
        if (currentFileContent) {
            setShowSaved(true);
            const timer = setTimeout(() => setShowSaved(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [currentFileContent]);

    const handleManualCompile = async () => {
        if (isCompiling) return;

        compilationAbortController.current = new AbortController();
        setIsCompiling(true);
        setCompilationError(null); // Clear previous errors

        try {
            const result = await LaTeXCompiler.compile(latexCode, projectFiles, compilationAbortController.current.signal);
            if (result.success) {
                setCompilationError(null); // Clear error on success
                setCompilationResult(result);
                addCompilationLog('success', 'Compilation successful');
            }
            else {
                setCompilationResult(null);
                const errorMsg = result.log || 'Compilation failed';
                setCompilationError(errorMsg);
                addCompilationLog('error', errorMsg);
            }
        } catch (error) {
            console.error('Compilation failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown compilation error';
            setCompilationError(errorMessage);
            setCompilationResult(null); // Clear previous result on error
            addCompilationLog('error', errorMessage);
        } finally {
            setIsCompiling(false);
            compilationAbortController.current = null;
        }
    };

    const handleCancelCompile = () => {
        if (compilationAbortController.current) {
            compilationAbortController.current.abort();
            compilationAbortController.current = null;
        }
        setIsCompiling(false);
        setCompilationError('Compilation cancelled by user');
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Register LaTeX as a custom language
        monaco.languages.register({ id: 'latex' });

        // Register LaTeX language configuration and syntax highlighting
        monaco.languages.setLanguageConfiguration('latex', {
            comments: {
                lineComment: '%',
            },
            brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')'],
            ],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '$', close: '$' },
                { open: '$$', close: '$$' },
            ],
            surroundingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '$', close: '$' },
            ],
        });

        // Register LaTeX syntax highlighting tokens
        monaco.languages.setMonarchTokensProvider('latex', {
            tokenizer: {
                root: [
                    // Comments
                    [/%.*$/, 'comment'],

                    // Math mode delimiters
                    [/\$\$/, 'keyword.math'],
                    [/\$/, 'keyword.math'],

                    // Commands
                    [/\\[a-zA-Z@]+/, {
                        cases: {
                            // Document structure
                            '@documentCommands': 'keyword.control',
                            // Sectioning
                            '@sectionCommands': 'keyword.section',
                            // Math commands
                            '@mathCommands': 'keyword.math',
                            // Formatting
                            '@formattingCommands': 'keyword.formatting',
                            // Default
                            '@default': 'keyword'
                        }
                    }],

                    // Special characters
                    [/[{}[\]()]/, 'delimiter.bracket'],
                    [/[&\\]/, 'delimiter'],

                    // Numbers
                    [/\d+(\.\d+)?/, 'number'],

                    // Environment names in \begin{} and \end{}
                    [/\\begin\{([^}]+)\}/, 'keyword.control'],
                    [/\\end\{([^}]+)\}/, 'keyword.control'],
                ],
            },

            // Command categories for syntax highlighting
            documentCommands: [
                'documentclass', 'usepackage', 'begin', 'end', 'item',
                'newcommand', 'renewcommand', 'newenvironment', 'renewenvironment',
                'include', 'input', 'bibliography', 'bibliographystyle',
            ],

            sectionCommands: [
                'part', 'chapter', 'section', 'subsection', 'subsubsection',
                'paragraph', 'subparagraph', 'title', 'author', 'date',
                'maketitle', 'tableofcontents', 'listoffigures', 'listoftables',
            ],

            mathCommands: [
                'frac', 'sqrt', 'sum', 'int', 'lim', 'infty', 'alpha', 'beta',
                'gamma', 'delta', 'epsilon', 'theta', 'lambda', 'mu', 'pi',
                'sigma', 'omega', 'partial', 'nabla', 'times', 'div', 'pm',
                'leq', 'geq', 'neq', 'approx', 'equiv', 'in', 'subset',
                'left', 'right', 'cdot', 'ldots', 'mathbb', 'mathcal',
                'mathrm', 'mathbf', 'mathit', 'text',
            ],

            formattingCommands: [
                'textbf', 'textit', 'texttt', 'underline', 'emph',
                'textsc', 'textsf', 'textrm', 'textsl',
                'tiny', 'scriptsize', 'footnotesize', 'small', 'normalsize',
                'large', 'Large', 'LARGE', 'huge', 'Huge',
                'centering', 'raggedright', 'raggedleft',
            ],
        });

        // Define custom theme for LaTeX
        monaco.editor.defineTheme('latex-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '569CD6' },
                { token: 'keyword.control', foreground: 'C586C0', fontStyle: 'bold' },
                { token: 'keyword.section', foreground: 'DCDCAA', fontStyle: 'bold' },
                { token: 'keyword.math', foreground: '4EC9B0' },
                { token: 'keyword.formatting', foreground: 'CE9178' },
                { token: 'delimiter.bracket', foreground: 'FFD700' },
                { token: 'delimiter', foreground: 'D4D4D4' },
                { token: 'number', foreground: 'B5CEA8' },
            ],
            colors: {
                'editor.background': '#1E1E1E',
            }
        });

        // Set the custom theme
        monaco.editor.setTheme('latex-dark');

        // Register custom LaTeX snippets
        monaco.languages.registerCompletionItemProvider('latex', {
            provideCompletionItems: (model, position, _context, _token) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const suggestions = [
                    {
                        label: 'begin-end',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\begin{${1:environment}}\n\t$0\n\\end{${1:environment}}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Begin-End environment',
                        range: range
                    },
                    {
                        label: 'section',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\section{${1:title}}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Section',
                        range: range
                    },
                    {
                        label: 'subsection',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\subsection{${1:title}}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Subsection',
                        range: range
                    },
                    {
                        label: 'equation',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\begin{equation}\n\t${1:equation}\n\\end{equation}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Equation environment',
                        range: range
                    },
                    {
                        label: 'itemize',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\begin{itemize}\n\t\\item ${1:first item}\n\t\\item ${2:second item}\n\\end{itemize}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Itemized list',
                        range: range
                    },
                    {
                        label: 'enumerate',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\begin{enumerate}\n\t\\item ${1:first item}\n\t\\item ${2:second item}\n\\end{enumerate}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Enumerated list',
                        range: range
                    },
                    {
                        label: 'figure',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\begin{figure}[${1:h}]\n\t\\centering\n\t\\includegraphics[width=${2:0.8}\\textwidth]{${3:filename}}\n\t\\caption{${4:caption}}\n\t\\label{fig:${5:label}}\n\\end{figure}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Figure environment',
                        range: range
                    },
                    {
                        label: 'table',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '\\begin{table}[${1:h}]\n\t\\centering\n\t\\begin{tabular}{${2:c c c}}\n\t\t${3:header} \\\\\\\\ \\hline\n\t\t${4:content} \\\\\\\\\n\t\\end{tabular}\n\t\\caption{${5:caption}}\n\t\\label{tab:${6:label}}\n\\end{table}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Table environment',
                        range: range
                    }
                ];

                return { suggestions };
            }
        });

        // Add custom key bindings
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Trigger manual compile in manual mode, otherwise auto-compile will handle it
            if (!autoCompile) {
                handleManualCompile();
            }
        });

        // Add bracket matching highlighting
        editor.updateOptions({
            matchBrackets: 'always',
            bracketPairColorization: { enabled: true }
        });
    };

    const handleFormatDocument = () => {
        if (editorRef.current) {
            editorRef.current.getAction('editor.action.formatDocument')?.run();
        }
    };

    const handleFind = () => {
        if (editorRef.current) {
            editorRef.current.getAction('actions.find')?.run();
        }
    };

    const handleUndo = () => {
        if (editorRef.current) {
            editorRef.current.trigger('keyboard', 'undo', null);
        }
    };

    const handleRedo = () => {
        if (editorRef.current) {
            editorRef.current.trigger('keyboard', 'redo', null);
        }
    };

    const handleCopyAll = () => {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                navigator.clipboard.writeText(model.getValue());
            }
        }
    };

    const handleDownload = () => {
        const blob = new Blob([latexCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.tex';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStats = () => {
        const lines = latexCode.split('\n').length;
        const words = latexCode.split(/\s+/).filter(Boolean).length;
        const chars = latexCode.length;
        return { lines, words, chars };
    };

    const stats = getStats();

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Header */}
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-semibold text-gray-300">LaTeX Editor</h2>
                        {showSaved && (
                            <span className="flex items-center gap-1 text-xs text-green-400 animate-fade-in">
                                <Check className="w-3 h-3" />
                                Saved
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                            title="Toggle stats"
                        >
                            <FileText className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setEditorFullscreen(!editorFullscreen)}
                            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                            title={editorFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                            {editorFullscreen ? (
                                <Minimize2 className="w-4 h-4" />
                            ) : (
                                <Maximize2 className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1">
                    {/* Compile Controls */}
                    <button
                        onClick={() => setAutoCompile(!autoCompile)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${autoCompile
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        title={autoCompile ? 'Auto-compile enabled' : 'Auto-compile disabled'}
                    >
                        <Zap className="w-3 h-3" />
                        {autoCompile ? 'Auto' : 'Manual'}
                    </button>

                    {!autoCompile && (
                        <>
                            {isCompiling ? (
                                <button
                                    onClick={handleCancelCompile}
                                    className="px-2 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1"
                                    title="Cancel compilation"
                                >
                                    <Square className="w-3 h-3" />
                                    Cancel
                                </button>
                            ) : (
                                <button
                                    onClick={handleManualCompile}
                                    className="px-2 py-1 rounded text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1"
                                    title="Compile now (Ctrl+S)"
                                >
                                    <Play className="w-3 h-3" />
                                    Compile
                                </button>
                            )}
                        </>
                    )}

                    <div className="w-px h-4 bg-gray-700 mx-1" />

                    <button
                        onClick={handleUndo}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleRedo}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-gray-700 mx-1" />
                    <button
                        onClick={handleFind}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="Find (Ctrl+F)"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleFormatDocument}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="Format Document"
                    >
                        <Type className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-gray-700 mx-1" />
                    <button
                        onClick={handleCopyAll}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="Copy all"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="Download .tex file"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </button>

                    {showStats && (
                        <div className="ml-auto flex items-center gap-4 text-xs text-gray-400">
                            <span>{stats.lines} lines</span>
                            <span>{stats.words} words</span>
                            <span>{stats.chars} chars</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1">
                <Editor
                    key={currentFile}
                    height="100%"
                    defaultLanguage="latex"
                    theme="vs-dark"
                    value={currentFileContent}
                    onChange={handleContentChange}
                    onMount={handleEditorDidMount}
                    options={{
                        // Display
                        minimap: { enabled: showMinimap, scale: 1 },
                        fontSize: fontSize,
                        fontFamily: "'Cascadia Code', 'Fira Code', 'Courier New', monospace",
                        fontLigatures: true,
                        lineNumbers: showLineNumbers ? 'on' : 'off',
                        rulers: [80],
                        renderWhitespace: 'selection',
                        renderLineHighlight: 'all',
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',

                        // Editing
                        wordWrap: 'on',
                        formatOnPaste: true,
                        formatOnType: true,
                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        autoIndent: 'full',
                        tabSize: 2,
                        insertSpaces: true,

                        // Behavior
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        smoothScrolling: true,
                        mouseWheelZoom: true,

                        // Features
                        folding: true,
                        foldingStrategy: 'indentation',
                        showFoldingControls: 'always',
                        find: {
                            addExtraSpaceOnTop: false,
                            autoFindInSelection: 'never',
                            seedSearchStringFromSelection: 'always'
                        },
                        matchBrackets: 'always',

                        // Suggestions
                        quickSuggestions: {
                            other: true,
                            comments: false,
                            strings: false
                        },
                        suggestOnTriggerCharacters: true,
                        acceptSuggestionOnEnter: 'on',
                        tabCompletion: 'on',
                        wordBasedSuggestions: 'matchingDocuments',

                        // Advanced
                        dragAndDrop: true,
                        links: true,
                        multiCursorModifier: 'ctrlCmd',
                        selectionHighlight: true,
                        occurrencesHighlight: 'singleFile',
                        codeLens: false,
                        lightbulb: {
                            enabled: true
                        },
                        parameterHints: {
                            enabled: true
                        },
                    }}
                />
            </div>
        </div>
    );
}
