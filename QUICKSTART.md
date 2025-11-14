# Quick Start Guide

Get up and running with LaTeX AI Editor in 5 minutes! 🚀

## 📥 Installation (2 minutes)

### Step 1: Clone & Install

```bash
# Clone the repository (or download ZIP)
git clone <repository-url>
cd latex_editor

# Install dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### Step 2: Start the Application

```bash
# Start both frontend and backend together
npm run dev:all

# OR run separately:
# Terminal 1:
cd server && npm start

# Terminal 2:
npm run dev
```

### Step 3: Open in Browser

Navigate to: **http://localhost:5173**

## ⚙️ Initial Setup (1 minute)

### Configure AI Provider (Optional)

1. Click the **⚙️ Settings** icon (top-right corner)
2. Choose an AI provider:
   - **Gemini** (Recommended for free tier)
   - **OpenAI** (GPT-3.5/GPT-4)
   - **Claude** (Anthropic)
   - **Ollama** (Local, private, free)
3. Enter your API key or endpoint
4. Click **Save**

> **Tip**: You can skip this and use the editor without AI features!

### Get API Keys

- **Gemini**: [Get free API key](https://makersuite.google.com/app/apikey) (60 req/min)
- **OpenAI**: [Get API key](https://platform.openai.com/api-keys) (Paid)
- **Claude**: [Get API key](https://console.anthropic.com/) (Paid)
- **Ollama**: [Install locally](https://ollama.ai) (Free, offline)

## ✍️ First LaTeX Document (2 minutes)

### 1. Write Your LaTeX

The editor comes with a sample document. Try editing it:

```latex
\documentclass{article}
\usepackage{amsmath}

\begin{document}

\title{My First Document}
\author{Your Name}
\date{\today}
\maketitle

\section{Introduction}
This is my first LaTeX document with AI assistance!

The quadratic formula is:
\[
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\]

\end{document}
```

### 2. Compile & Preview

- **Auto Mode**: Document compiles automatically when you stop typing
- **Manual Mode**: Click **⚡ Compile** button or press `Ctrl+S`

Wait a few seconds, and your PDF appears on the right! 📄

### 3. Use AI Commands

Click the **🤖 AI Assistant** button (bottom-right) and try:

**💡 Write Command**
```
Create a table showing days of the week with their abbreviations
```

**🔍 Debug Command**
```
[Click Debug if you have compilation errors]
```

**🔧 Fix Command**
```
[Click Fix to automatically correct errors]
```

## 📁 Multi-File Projects

### Add Files

1. Click **File Manager** (left sidebar)
2. Click **➕ New File**
3. Choose type:
   - `.tex` - LaTeX source
   - `.bib` - Bibliography
   - Images (PNG, JPG, etc.)

### Use Files in Your Document

```latex
% Include another .tex file
\input{chapters/introduction.tex}

% Add bibliography
\bibliography{references.bib}

% Include images
\includegraphics{figures/diagram.png}
```

## 🎨 Customize Your Workspace

### Editor Settings (⚙️ → Editor)

- **Font Size**: Adjust text size (12-24px)
- **Line Numbers**: Show/hide line numbers
- **Minimap**: Toggle document overview
- **Word Wrap**: Enable text wrapping
- **Keybindings**: Choose Vim, Emacs, or default

### Layout Options

- **Resize Panels**: Drag the divider between panels
- **Fullscreen**: Click maximize icon on editor or preview
- **File Manager**: Toggle sidebar open/closed
- **AI Assistant**: Minimize, drag to reposition, or close

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Compile Document | `Ctrl+S` / `Cmd+S` |
| Send AI Message | `Ctrl+Enter` / `Cmd+Enter` |
| New Line in AI | `Shift+Enter` |
| Fullscreen | `F11` |
| Toggle Minimap | Settings → Editor |

## 🎯 Common Tasks

### Creating a Table

Ask AI:
```
Write a 3-column table showing student names, scores, and grades
```

### Adding Math Equations

```latex
% Inline math
The equation $E = mc^2$ is famous.

% Display math
\[
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\]
```

### Including Images

1. Upload image via File Manager
2. Add to document:
```latex
\begin{figure}[h]
  \centering
  \includegraphics[width=0.8\textwidth]{myimage.png}
  \caption{My Image}
  \label{fig:myimage}
\end{figure}
```

### Creating References

1. Create `references.bib` file
2. Add entries:
```bibtex
@article{einstein1905,
  author = {Einstein, Albert},
  title = {On the Electrodynamics of Moving Bodies},
  journal = {Annalen der Physik},
  year = {1905}
}
```
3. In your document:
```latex
\cite{einstein1905}
\bibliography{references}
\bibliographystyle{plain}
```

## 🚨 Troubleshooting

### PDF Not Showing?

- Wait 5-10 seconds for compilation
- Check **Logs** tab for errors
- Ensure your LaTeX syntax is correct
- Try the **Fix** button for automatic corrections

### AI Not Working?

- Verify API key in Settings
- Check your internet connection
- Ensure you haven't exceeded API rate limits
- Try a different AI provider

### Compilation Errors?

1. Switch to **Logs** tab to see errors
2. Click **🔍 Debug** to ask AI for help
3. Click **🔧 Fix** to auto-correct
4. Check LaTeX syntax

### Slow Performance?

- Large PDFs take time to render
- Clear browser cache
- Close unused tabs
- Use manual compilation mode

## 💡 Pro Tips

1. **Auto-save**: Your work saves automatically to browser storage
2. **Organize Files**: Use folders in File Manager for big projects
3. **Preview Images**: Click images in File Manager to see them
4. **Diff View**: Use AI "Improve" to see changes before applying
5. **Abort Requests**: Click stop button to cancel slow AI requests
6. **Drag AI Widget**: Move the AI Assistant anywhere on screen
7. **Logs History**: View last 50 compilations in Logs tab
8. **Copy Code**: Click AI suggestions to copy LaTeX code

## 📚 Learning Resources

### LaTeX Tutorials
- [Overleaf Learn LaTeX](https://www.overleaf.com/learn)
- [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX)
- [CTAN Packages](https://ctan.org/)

### AI Prompts
- "Write LaTeX code for..." (generates code)
- "Explain this error..." (debugging help)
- "Improve the formatting of..." (enhancements)
- "Create a template for..." (document templates)

## 🎓 Example Projects

Try these starter templates:

### Academic Paper
```latex
\documentclass[12pt]{article}
\usepackage{amsmath,amssymb,graphicx}
\title{Research Paper Title}
\author{Your Name}
\begin{document}
\maketitle
\begin{abstract}
Your abstract here.
\end{abstract}
\section{Introduction}
% Your content
\end{document}
```

### Resume/CV
Ask AI: "Create a professional resume template in LaTeX"

### Presentation (Beamer)
Ask AI: "Create a Beamer presentation with 3 slides"

## 🆘 Need Help?

- **Documentation**: Check [README.md](README.md)
- **Issues**: [Report bugs](repository-url/issues)
- **Discussions**: [Ask questions](repository-url/discussions)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

## 🎉 You're Ready!

You now know the basics of LaTeX AI Editor. Start creating amazing documents!

**Happy LaTeXing! 📝✨**

---

**Next Steps:**
- Explore the [Full Documentation](README.md)
- Read [Deployment Guide](DEPLOYMENT.md) to host your own
- Check [CHANGELOG.md](CHANGELOG.md) for latest features
- Join the community and contribute!
