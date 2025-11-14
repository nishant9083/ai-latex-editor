# Contributing to LaTeX AI Editor

First off, thank you for considering contributing to LaTeX AI Editor! It's people like you that make this tool better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Good bug reports include:**
- Clear, descriptive title
- Exact steps to reproduce the problem
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information
- Error messages or console logs

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11, macOS Sonoma]
- Browser: [e.g., Chrome 119, Firefox 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**Good enhancement suggestions include:**
- Clear, descriptive title
- Detailed description of proposed functionality
- Explanation of why this enhancement would be useful
- Possible implementation approach (optional)
- Mockups or examples (if applicable)

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages** (`git commit -m 'Add amazing feature'`)
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## 🛠️ Development Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git**
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/latex_editor.git
cd latex_editor

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/latex_editor.git

# Install dependencies
npm install
cd server
npm install
cd ..
```

### Running Development Environment

```bash
# Option 1: Run both frontend and backend together
npm run dev:all

# Option 2: Run separately
# Terminal 1
cd server
npm run dev

# Terminal 2
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update documentation** if you're changing functionality
2. **Follow coding standards** (see below)
3. **Test your changes** thoroughly
4. **Update README.md** if adding new features
5. **Ensure build succeeds** (`npm run build`)
6. **Check for linting errors** (`npm run lint`)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested on multiple browsers (if UI change)

## Screenshots (if applicable)
Add screenshots showing the changes
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **At least one maintainer** must review
3. **Address feedback** promptly and courteously
4. **Squash commits** if requested
5. **Maintainer will merge** when approved

## 💻 Coding Standards

### TypeScript/JavaScript

```typescript
// ✅ Good - Use descriptive names
const compilationResult = await compileLatex(code);

// ❌ Bad - Vague names
const res = await compile(c);

// ✅ Good - Proper typing
interface CompilationResult {
  success: boolean;
  pdf?: string;
  error?: string;
}

// ❌ Bad - Using 'any'
const result: any = await compileLatex(code);
```

**Guidelines:**
- Use TypeScript for type safety
- Prefer `const` over `let`, never use `var`
- Use async/await over promises
- Add JSDoc comments for complex functions
- Keep functions small and focused
- Use meaningful variable names
- Follow existing code style

### React Components

```typescript
// ✅ Good - Functional component with proper types
interface EditorProps {
  code: string;
  onChange: (value: string) => void;
}

export default function Editor({ code, onChange }: EditorProps) {
  // Component logic
  return <div>...</div>;
}

// ❌ Bad - No types, class component
export default class Editor extends React.Component {
  // Avoid class components
}
```

**Guidelines:**
- Use functional components with hooks
- Define prop interfaces
- Use meaningful component names (PascalCase)
- Keep components focused on single responsibility
- Extract reusable logic into custom hooks
- Use proper React patterns (keys, refs, etc.)

### CSS/Tailwind

```tsx
// ✅ Good - Semantic, organized classes
<div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg">

// ❌ Bad - Inline styles, disorganized
<div style={{display: 'flex'}} className="px-4 gap-2 items-center rounded-lg py-2 bg-gray-900">
```

**Guidelines:**
- Use Tailwind utility classes
- Group related classes (layout, spacing, colors)
- Avoid inline styles unless necessary
- Use consistent spacing scale
- Follow dark theme color palette

### Git Commits

```bash
# ✅ Good - Clear, descriptive
git commit -m "Add drag-and-drop support to AI Assistant"
git commit -m "Fix PDF persistence when switching tabs"

# ❌ Bad - Vague
git commit -m "update"
git commit -m "fix bug"
```

**Commit Message Format:**
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AIAssistant.tsx     # AI chat interface
│   ├── Editor.tsx          # Monaco editor wrapper
│   ├── Preview.tsx         # PDF preview & logs
│   ├── FileManager.tsx     # File explorer
│   ├── Toolbar.tsx         # Top toolbar
│   └── Settings.tsx        # Settings modal
├── services/            # Business logic
│   ├── aiService.ts        # AI provider integrations
│   └── latexCompiler.ts    # LaTeX compilation
├── store/               # State management
│   └── editorStore.ts      # Zustand global store
├── types/               # TypeScript types
└── main.tsx             # Entry point
```

**Component Guidelines:**
- Each component in its own file
- Co-locate related components
- Keep components under 300 lines
- Extract complex logic to services
- Use custom hooks for reusable logic

## 🧪 Testing

### Manual Testing Checklist

Before submitting PR, verify:

- [ ] **Editor**: Type, edit, syntax highlighting works
- [ ] **Compilation**: LaTeX compiles to PDF
- [ ] **Multi-file**: Can add/edit multiple files
- [ ] **AI Commands**: Write, Debug, Fix, Improve work
- [ ] **File Manager**: Add, delete, preview files
- [ ] **Settings**: Can configure AI providers
- [ ] **Persistence**: Data saves to localStorage
- [ ] **Responsive**: Works on different screen sizes
- [ ] **Error Handling**: Errors display properly
- [ ] **Performance**: No lag or freezing

### Browser Testing

Test on at least 2 browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on macOS)

## 📝 Issue Guidelines

### Creating Issues

**Use appropriate labels:**
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

**Before creating an issue:**
1. Search existing issues (open and closed)
2. Check if it's already being worked on
3. Verify it's not in the roadmap
4. Ensure you have latest version

### Working on Issues

1. **Comment on the issue** you want to work on
2. **Wait for assignment** from maintainers
3. **Ask questions** if requirements unclear
4. **Provide updates** if taking longer than expected
5. **Link your PR** to the issue

## 🎯 Development Tips

### VS Code Extensions (Recommended)

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript Vue Plugin (Volar)** - Better TS support

### Useful Commands

```bash
# Lint code
npm run lint

# Build project
npm run build

# Preview production build
npm run preview

# Check TypeScript errors
npx tsc --noEmit
```

### Debugging

- Use browser DevTools
- Add `console.log` for debugging (remove before PR)
- Use React DevTools extension
- Check Network tab for API calls
- Monitor localStorage in Application tab

## 📞 Getting Help

- **Documentation**: Check README.md first
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create issue if you find a bug
- **Discord/Slack**: [If applicable, add community links]

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Credited in commit history

Thank you for contributing to LaTeX AI Editor! 🎉

---

**Questions?** Feel free to ask in GitHub Discussions or create an issue.
