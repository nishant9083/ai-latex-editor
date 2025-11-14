# LaTeX AI Editor

A modern, live LaTeX editor with AI assistance powered by multiple providers (Gemini, Ollama, OpenAI, Anthropic, etc.).

## Features

- 🎨 **Live Preview**: Real-time LaTeX compilation and PDF preview
- 🤖 **AI Assistance**: Write, debug, and fix LaTeX code with AI
- 🔌 **Multi-Provider Support**: Use your own API keys for different AI providers
  - Google Gemini
  - Ollama (local models)
  - OpenAI
  - Anthropic Claude
- ✨ **Monaco Editor**: Professional code editing experience with syntax highlighting
- 📱 **Responsive Design**: Works on desktop and tablet devices
- 💾 **Auto-Save**: Your work is automatically saved to browser localStorage
  - LaTeX code persists across sessions
  - Editor preferences (font size, minimap, line numbers)
  - Compilation mode (auto/manual)
  - Panel layout and dimensions
  - AI provider settings and API keys

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

### Build

```bash
npm run build
```

## Configuration

1. Click the Settings icon in the top-right corner
2. Select your preferred AI provider
3. Enter your API key or endpoint URL
4. Start using AI assistance features!

## AI Providers Setup

### Google Gemini
- Get your API key from: https://makersuite.google.com/app/apikey

### Ollama (Local)
- Install Ollama from: https://ollama.ai
- Run: `ollama serve`
- Default URL: `http://localhost:11434`

### OpenAI
- Get your API key from: https://platform.openai.com/api-keys

### Anthropic
- Get your API key from: https://console.anthropic.com/

## Usage

1. Write your LaTeX code in the left editor
2. See live preview on the right
3. Use AI commands:
   - **Write**: Ask AI to generate LaTeX code
   - **Debug**: Find and explain errors in your code
   - **Fix**: Automatically fix compilation errors

## License

MIT
