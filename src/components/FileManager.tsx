import { useState, useRef } from 'react';
import { File, Plus, Trash2, FileText, Image, Book, X, Upload, ChevronRight, ChevronDown, FolderOpen, Folder } from 'lucide-react';
import { useEditorStore, ProjectFile } from '../store/editorStore';

export default function FileManager() {
  const { 
    projectFiles, 
    addProjectFile, 
    removeProjectFile, 
    currentFile, 
    setCurrentFile,
  } = useEditorStore();
  
  const [isOpen, setIsOpen] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'tex' | 'bib' | 'image' | 'other'>('tex');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [imagePreview, setImagePreview] = useState<{ name: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string, isExpanded?: boolean) => {
    switch (type) {
      case 'folder':
        return isExpanded ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />;
      case 'tex':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'bib':
        return <Book className="w-4 h-4 text-green-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-purple-400" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;

    let fileName = newFileName.trim();
    
    // Add appropriate extension if not present
    if (newFileType === 'tex' && !fileName.endsWith('.tex')) {
      fileName += '.tex';
    } else if (newFileType === 'bib' && !fileName.endsWith('.bib')) {
      fileName += '.bib';
    }

    // Check if file already exists
    if (projectFiles.some(f => f.name === fileName) || fileName === 'main.tex') {
      alert('File already exists!');
      return;
    }

    const newFile: ProjectFile = {
      name: fileName,
      content: newFileType === 'bib' ? '@article{example,\n  title={Example},\n  author={Author},\n  year={2024}\n}' : '',
      type: newFileType
    };

    addProjectFile(newFile);
    setNewFileName('');
    setShowAddMenu(false);
    
    // Switch to the newly created file - the Editor will load its content automatically
    setCurrentFile(fileName);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      // Check if image already exists
      if (projectFiles.some(f => f.name === file.name)) {
        alert(`Image ${file.name} already exists!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // Remove data URL prefix
        const base64Data = base64.split(',')[1];
        
        addProjectFile({
          name: file.name,
          content: base64Data,
          type: 'image'
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileClick = (fileName: string) => {
    const file = projectFiles.find(f => f.name === fileName);
    
    // If it's an image, show preview modal instead of editing
    if (file && file.type === 'image') {
      setImagePreview({ name: fileName, content: file.content });
      return;
    }
    
    // Only set the current file - the Editor will handle loading the content
    setCurrentFile(fileName);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folder)) {
        newSet.delete(folder);
      } else {
        newSet.add(folder);
      }
      return newSet;
    });
  };

  // Group files by type
  const texFiles = projectFiles.filter(f => f.type === 'tex');
  const bibFiles = projectFiles.filter(f => f.type === 'bib');
  const imageFiles = projectFiles.filter(f => f.type === 'image');
  const otherFiles = projectFiles.filter(f => f.type === 'other');

  if (!isOpen) {
    return (
      <div className="h-full bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2 w-12">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Open file explorer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="mt-4 flex flex-col gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            <Image className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-700" style={{ width: '250px' }}>
      {/* Header */}
      <div className="px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              title="Close file explorer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-semibold text-gray-300">Files</h3>
          </div>
          <button
            onClick={() => setShowAddMenu(true)}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Add file"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>Editing:</span>
          <span className="text-blue-400 font-medium">{currentFile}</span>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto text-sm">
        {/* Main file */}
        <button
          onClick={() => {
            setCurrentFile('main.tex');
          }}
          className={`w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-colors text-left ${
            currentFile === 'main.tex' ? 'bg-gray-800 border-l-2 border-blue-500' : ''
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">main.tex</span>
        </button>

        {/* LaTeX Files Folder */}
        {texFiles.length > 0 && (
          <div>
            <button
              onClick={() => toggleFolder('tex')}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-colors text-left text-gray-400"
            >
              {expandedFolders.has('tex') ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {getFileIcon('folder', expandedFolders.has('tex'))}
              <span className="text-xs font-medium">LaTeX Files</span>
            </button>
            {expandedFolders.has('tex') && texFiles.map((file) => (
              <div
                key={file.name}
                className={`group flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-800 transition-colors ${
                  currentFile === file.name ? 'bg-gray-800 border-l-2 border-blue-500' : ''
                }`}
              >
                <button
                  onClick={() => handleFileClick(file.name)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  {getFileIcon(file.type)}
                  <span className="text-gray-300 text-xs">{file.name}</span>
                </button>
                <button
                  onClick={() => removeProjectFile(file.name)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-all"
                  title="Remove file"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bibliography Files Folder */}
        {bibFiles.length > 0 && (
          <div>
            <button
              onClick={() => toggleFolder('bib')}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-colors text-left text-gray-400"
            >
              {expandedFolders.has('bib') ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {getFileIcon('folder', expandedFolders.has('bib'))}
              <span className="text-xs font-medium">Bibliography</span>
            </button>
            {expandedFolders.has('bib') && bibFiles.map((file) => (
              <div
                key={file.name}
                className={`group flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-800 transition-colors ${
                  currentFile === file.name ? 'bg-gray-800 border-l-2 border-blue-500' : ''
                }`}
              >
                <button
                  onClick={() => handleFileClick(file.name)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  {getFileIcon(file.type)}
                  <span className="text-gray-300 text-xs">{file.name}</span>
                </button>
                <button
                  onClick={() => removeProjectFile(file.name)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-all"
                  title="Remove file"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Images Folder */}
        {imageFiles.length > 0 && (
          <div>
            <button
              onClick={() => toggleFolder('images')}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-colors text-left text-gray-400"
            >
              {expandedFolders.has('images') ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {getFileIcon('folder', expandedFolders.has('images'))}
              <span className="text-xs font-medium">Images</span>
            </button>
            {expandedFolders.has('images') && imageFiles.map((file) => (
              <div
                key={file.name}
                className={`group flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-800 transition-colors ${
                  currentFile === file.name ? 'bg-gray-800 border-l-2 border-purple-500' : ''
                }`}
              >
                <button
                  onClick={() => handleFileClick(file.name)}
                  className="flex items-center gap-2 flex-1 text-left min-w-0"
                >
                  {/* Image thumbnail */}
                  <div className="w-8 h-8 rounded border border-gray-700 overflow-hidden flex-shrink-0 bg-gray-800">
                    <img 
                      src={`data:image/png;base64,${file.content}`}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                      }}
                    />
                  </div>
                  <span className="text-gray-300 text-xs truncate">{file.name}</span>
                </button>
                <button
                  onClick={() => removeProjectFile(file.name)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-all flex-shrink-0"
                  title="Remove file"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Other Files */}
        {otherFiles.length > 0 && otherFiles.map((file) => (
          <div
            key={file.name}
            className={`group flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 transition-colors ${
              currentFile === file.name ? 'bg-gray-800 border-l-2 border-blue-500' : ''
            }`}
          >
            <button
              onClick={() => handleFileClick(file.name)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              {getFileIcon(file.type)}
              <span className="text-gray-300 text-xs">{file.name}</span>
            </button>
            <button
              onClick={() => removeProjectFile(file.name)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-all"
              title="Remove file"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {projectFiles.length === 0 && (
          <div className="px-3 py-8 text-center text-gray-500 text-xs">
            <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No additional files</p>
            <p className="text-xs mt-1">Click + to add files</p>
          </div>
        )}
      </div>

      {/* Add File Dialog */}
      {showAddMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add File</h3>
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  setNewFileName('');
                }}
                className="p-1 rounded hover:bg-gray-700 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* File Type Selection */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">File Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewFileType('tex')}
                    className={`px-3 py-2 rounded flex items-center gap-2 text-sm transition-colors ${
                      newFileType === 'tex' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    LaTeX File
                  </button>
                  <button
                    onClick={() => setNewFileType('bib')}
                    className={`px-3 py-2 rounded flex items-center gap-2 text-sm transition-colors ${
                      newFileType === 'bib' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Book className="w-4 h-4" />
                    Bibliography
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image(s)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF supported</p>
              </div>

              {newFileType !== 'image' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">File Name</label>
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFile()}
                      placeholder={newFileType === 'bib' ? 'references.bib' : 'chapter1.tex'}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleAddFile}
                    disabled={!newFileName.trim()}
                    className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                  >
                    Add File
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setImagePreview(null)}>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{imagePreview.name}</h3>
              <button
                onClick={() => setImagePreview(null)}
                className="p-1 rounded hover:bg-gray-700 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center">
              <img 
                src={`data:image/png;base64,${imagePreview.content}`}
                alt={imagePreview.name}
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            </div>
            <div className="mt-4 p-3 bg-gray-900 rounded">
              <p className="text-xs text-gray-400 mb-1">LaTeX code to include this image:</p>
              <code className="text-sm text-green-400 block">
                {`\\includegraphics[width=0.8\\textwidth]{${imagePreview.name}}`}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
