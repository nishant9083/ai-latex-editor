# Changelog

All notable changes to LaTeX AI Editor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-14

### 🎉 Initial Release

#### Added - Core Features
- **Monaco Editor Integration**: Professional code editing with syntax highlighting
- **Real-time LaTeX Compilation**: Instant PDF preview using LaTeX.Online API
- **Multi-file Project Support**: Handle `.tex`, `.bib`, and image files
- **AI Assistance**: Integrated support for multiple AI providers:
  - Google Gemini
  - OpenAI GPT-3.5/GPT-4
  - Anthropic Claude
  - Ollama (local models)
- **AI Commands**:
  - Write: Generate LaTeX code from descriptions
  - Debug: Analyze and explain compilation errors
  - Fix: Automatically fix LaTeX errors
  - Improve: Get AI suggestions with diff preview

#### Added - User Interface
- **Three-Panel Layout**: Editor, Preview, and AI Assistant
- **Floating AI Widget**: Draggable LinkedIn-style chat interface
- **Overleaf-style File Manager**: Organized folders for LaTeX, Bibliography, and Images
- **Tabbed Preview**: Switch between PDF preview and compilation logs
- **Resizable Panels**: Customize workspace layout
- **Fullscreen Modes**: Focus on editing or preview
- **Dark Theme**: Eye-friendly interface optimized for long sessions

#### Added - Editor Features
- **Custom LaTeX Language**: Syntax highlighting and autocomplete
- **Line Numbers**: Toggle line numbers visibility
- **Minimap**: Overview of document structure
- **Word Wrap**: Toggle word wrapping
- **Font Size Control**: Adjustable editor font size (12-24px)
- **Key Bindings**: Vim, Emacs, and default keymaps

#### Added - File Management
- **File Explorer**: Browse and manage project files
- **Image Preview**: View images with LaTeX include code
- **File Upload**: Drag-and-drop or click to upload
- **Multi-file Compilation**: Bundle files into tar.gz for compilation
- **Base64 Image Support**: Store images in localStorage

#### Added - Compilation
- **Auto-compile Mode**: Compile on save
- **Manual Compile**: Compile on demand
- **Error Handling**: Display compilation errors with timestamps
- **Compilation Logs**: History of last 50 compilations
- **PDF Download**: Export compiled PDFs

#### Added - Persistence
- **localStorage**: Auto-save all work
- **Session Persistence**: 
  - LaTeX code
  - Project files
  - Editor preferences
  - Panel layouts
  - AI provider settings
  - API keys (encrypted in browser)

#### Added - AI Features
- **Multi-provider Support**: Switch between AI providers
- **API Key Management**: Store keys securely in browser
- **Abort Control**: Cancel long-running AI requests
- **Diff Preview**: Side-by-side comparison of AI suggestions
- **Conversation History**: Track AI interactions
- **Markdown Rendering**: Format AI responses with syntax highlighting

#### Added - Developer Experience
- **TypeScript**: Full type safety
- **Zustand**: Efficient state management
- **Vite**: Fast development and build
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Code quality checks
- **Express Backend**: CORS proxy for compilation

#### Added - Documentation
- **README.md**: Comprehensive project documentation
- **CONTRIBUTING.md**: Contribution guidelines and code of conduct
- **DEPLOYMENT.md**: Deployment guide for various platforms
- **LICENSE**: MIT License
- **.env.example**: Environment variables template
- **Logo & Favicon**: SVG branding assets

#### Added - Production Ready
- **Optimized Build**: Minified and tree-shaken
- **Meta Tags**: SEO and social media optimization
- **PWA Support**: Manifest.json for installable app
- **Security Headers**: X-Frame-Options, CSP, etc.
- **Performance**: Lazy loading and code splitting
- **Error Boundaries**: Graceful error handling

### Technical Details

#### Dependencies
- React 18.3.1
- TypeScript 5.3.3
- Vite 5.0.8
- Monaco Editor 0.45.0
- Zustand 4.4.7
- Tailwind CSS 3.4.0
- Express.js 4.18.2
- Axios 1.6.2

#### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### Performance Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: 90+

### Known Issues
- Large PDFs (>10MB) may take time to load
- Monaco Editor requires JavaScript (no fallback)
- localStorage has 10MB limit (affects large projects)

### Security
- API keys stored in browser localStorage (not server)
- CORS proxy prevents direct API exposure
- Content Security Policy headers
- XSS protection enabled

---

## [Unreleased]

### Planned Features
- Real-time collaboration with WebSockets
- GitHub integration for version control
- Template library for common documents
- Custom themes and color schemes
- Plugin system for extensions
- Mobile responsive improvements
- Offline mode with service workers
- LaTeX package manager
- Export to Overleaf
- BibTeX editor with validation

### Under Consideration
- Self-hosted compilation server
- Premium AI features
- Team workspaces
- Document sharing
- Version history with diff view
- Spell check integration
- Grammar checking
- Citation management

---

## Version History

- **1.0.0** (2025-11-14) - Initial public release

---

## Migration Guides

### Migrating to 1.0.0
This is the initial release. No migration needed.

---

## Support

For issues, feature requests, or questions:
- 🐛 [Report a Bug](repository-url/issues/new?template=bug_report.md)
- 💡 [Request a Feature](repository-url/issues/new?template=feature_request.md)
- 💬 [Join Discussions](repository-url/discussions)

---

**Note**: This changelog is updated with each release. For detailed commit history, see the [Git log](repository-url/commits).
