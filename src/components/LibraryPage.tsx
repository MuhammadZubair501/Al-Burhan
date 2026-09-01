// src/pages/LibraryPage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  FolderPlus,
  Upload,
  Trash2,
  Download,
  ChevronLeft,
  RefreshCw,
  Search,
  Grid,
  List,
  FolderOpen,
  FileUp,
  Folder,
  FolderUp,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FileIcon from '../components/Mega/FileIcon';
import ProgressPopup from '../components/Mega/ProgressPopup';
import { megaService } from '../services/megaService';
import type { MegaItem, MegaFolder } from '../types/mega.types';
import { formatFileSize } from '../utils/formatters';
import Swal from 'sweetalert2';
import ProfileButton from '../components/ProfileButton';

// ============================================
// FOLDERS TO HIDE FROM LIBRARY
// ============================================
const HIDDEN_FOLDERS: string[] = ['profile_images'];

export default function LibraryPage() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [items, setItems] = useState<MegaItem[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; path: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadQueue, setUploadQueue] = useState<{ file: File; relativePath: string }[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Updated: Track download popup state
  const [downloadPopup, setDownloadPopup] = useState<{
    show: boolean;
    file: { name: string; path: string; size?: number; mime?: string };
  }>({
    show: false,
    file: { name: '', path: '' }
  });
  
  // REMOVED: downloadingFiles state (not needed anymore)
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef<number>(0);

  // Load folder contents
  const loadFolder = async (path: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const folder: MegaFolder = await megaService.getFolder(path);
      
      let filteredItems = folder.items || [];
      
      const isRootLevel = path === '' || path === '/';
      const isInsideHiddenFolder = HIDDEN_FOLDERS.some((hidden: string) => 
        path.startsWith(hidden) || path.includes(`/${hidden}/`)
      );
      
      if (isRootLevel) {
        filteredItems = filteredItems.filter((item: MegaItem) => 
          !(item.isFolder && HIDDEN_FOLDERS.includes(item.name))
        );
      }
      
      if (isInsideHiddenFolder) {
        filteredItems = filteredItems.filter((item: MegaItem) => 
          !(item.isFolder && HIDDEN_FOLDERS.includes(item.name))
        );
      }
      
      setItems(filteredItems);
      setBreadcrumb(folder.breadcrumb || []);
      setCurrentPath(path);
    } catch (err: any) {
      setError(err.message || 'Failed to load folder');
    } finally {
      setLoading(false);
    }
  };

  // Prevent navigation into hidden folders
  const navigateToFolder = (path: string) => {
    const isHidden = HIDDEN_FOLDERS.some((hidden: string) => 
      path === hidden || path.startsWith(`${hidden}/`)
    );
    
    if (isHidden) {
      setError('This folder is system protected and not accessible.');
      return;
    }
    
    loadFolder(path);
  };

  // Navigate up
  const navigateUp = () => {
    if (currentPath) {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      const parentPath = pathParts.join('/');
      
      const isParentHidden = HIDDEN_FOLDERS.some((hidden: string) => 
        parentPath === hidden || parentPath.startsWith(`${hidden}/`)
      );
      
      if (isParentHidden) {
        const grandParentParts = parentPath.split('/').filter(Boolean);
        grandParentParts.pop();
        const grandParentPath = grandParentParts.join('/');
        loadFolder(grandParentPath);
      } else {
        loadFolder(parentPath);
      }
    }
  };

  useEffect(() => {
    loadFolder('');
  }, []);

  // Create folder structure recursively
  const createFolderStructure = async (basePath: string, folderPath: string) => {
    const parts = folderPath.split('/').filter(Boolean);
    let currentPath = basePath;
    
    for (const part of parts) {
      if (HIDDEN_FOLDERS.includes(part)) {
        continue;
      }
      
      try {
        const folder = await megaService.getFolder(currentPath);
        const exists = folder.items?.some((item: MegaItem) => item.isFolder && item.name === part);
        
        if (!exists) {
          await megaService.createFolder(currentPath, part);
        }
        currentPath = currentPath ? `${currentPath}/${part}` : part;
      } catch (err) {
        try {
          await megaService.createFolder(currentPath, part);
          currentPath = currentPath ? `${currentPath}/${part}` : part;
        } catch (createErr) {
          console.log('Folder creation skipped:', createErr);
          currentPath = currentPath ? `${currentPath}/${part}` : part;
        }
      }
    }
    return currentPath;
  };

  // Process upload queue
  const processUploadQueue = useCallback(async (files: { file: File; relativePath: string }[]) => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    
    let completed = 0;
    const total = files.length;

    const filesByFolder = new Map<string, File[]>();
    
    for (const { file, relativePath } of files) {
      let folderPath = '';
      
      if (relativePath && relativePath.includes('/')) {
        const pathParts = relativePath.split('/');
        pathParts.pop();
        folderPath = pathParts.join('/');
      }
      
      const key = folderPath || 'root';
      if (!filesByFolder.has(key)) {
        filesByFolder.set(key, []);
      }
      filesByFolder.get(key)!.push(file);
    }

    for (const [folderPath, folderFiles] of filesByFolder) {
      let targetPath = currentPath;
      
      if (folderPath && folderPath !== 'root') {
        const pathParts = folderPath.split('/');
        const hasHiddenPart = pathParts.some((part: string) => HIDDEN_FOLDERS.includes(part));
        
        if (hasHiddenPart) {
          setError(`Cannot upload to system protected folder: ${folderPath}`);
          continue;
        }
        
        targetPath = await createFolderStructure(currentPath, folderPath);
      }
      
      for (const file of folderFiles) {
        try {
          setUploadFileName(file.name);
          await megaService.uploadFileWithProgress(file, targetPath, (progress: number) => {
            const overallProgress = Math.round(((completed + progress / 100) / total) * 100);
            setUploadProgress(overallProgress);
          });
          
          completed++;
          setUploadProgress(Math.round((completed / total) * 100));
        } catch (err: any) {
          setError(`Failed to upload ${file.name}: ${err.message}`);
        }
      }
    }

    await loadFolder(currentPath);
    
    setUploading(false);
    setUploadProgress(null);
    setUploadFileName('');
    setUploadQueue([]);
  }, [currentPath]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
    dragCounterRef.current = 0;

    const uploadQueue: { file: File; relativePath: string }[] = [];

    async function readEntry(entry: any, path = ""): Promise<void> {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file((file: File) => {
            const pathParts = path.split('/');
            const hasHiddenPart = pathParts.some((part: string) => HIDDEN_FOLDERS.includes(part));
            
            if (hasHiddenPart) {
              resolve();
              return;
            }
            
            uploadQueue.push({
              file,
              relativePath: path ? `${path}/${file.name}` : file.name,
            });
            resolve();
          });
        });
      }

      if (entry.isDirectory) {
        if (HIDDEN_FOLDERS.includes(entry.name)) {
          return Promise.resolve();
        }
        
        const reader = entry.createReader();

        return new Promise((resolve) => {
          const readEntries = () => {
            reader.readEntries(async (entries: any[]) => {
              if (!entries.length) {
                resolve();
                return;
              }

              for (const child of entries) {
                await readEntry(
                  child,
                  path ? `${path}/${entry.name}` : entry.name
                );
              }

              readEntries();
            });
          };

          readEntries();
        });
      }
    }

    const items = e.dataTransfer.items;

    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const entry = (items[i] as any).webkitGetAsEntry?.();
      if (entry) {
        await readEntry(entry);
      }
    }

    if (uploadQueue.length > 0) {
      setUploadQueue(uploadQueue);
      processUploadQueue(uploadQueue);
    }
  }, [processUploadQueue]);

  // Create folder
  const handleCreateFolder = async () => {
    const folderName = newFolderName.trim();
    if (!folderName) return;
    
    if (HIDDEN_FOLDERS.includes(folderName)) {
      setError(`Cannot create system protected folder: ${folderName}`);
      return;
    }
    
    try {
      await megaService.createFolder(currentPath, folderName);
      setShowNewFolderModal(false);
      setNewFolderName('');
      loadFolder(currentPath);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Upload file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const fileQueue: { file: File; relativePath: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = (file as any).webkitRelativePath || '';
      
      const pathParts = relativePath.split('/');
      const hasHiddenPart = pathParts.some((part: string) => HIDDEN_FOLDERS.includes(part));
      
      if (!hasHiddenPart) {
        fileQueue.push({ file, relativePath });
      }
    }
    
    setUploadQueue(fileQueue);
    await processUploadQueue(fileQueue);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload folder
  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileQueue: { file: File; relativePath: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = (file as any).webkitRelativePath || '';
      
      if (file.name.startsWith('.')) continue;
      if (file.name === 'Thumbs.db') continue;
      
      const pathParts = relativePath.split('/');
      const hasHiddenPart = pathParts.some((part: string) => HIDDEN_FOLDERS.includes(part));
      
      if (!hasHiddenPart) {
        fileQueue.push({ file, relativePath });
      }
    }
    
    if (fileQueue.length > 0) {
      setUploadQueue(fileQueue);
      await processUploadQueue(fileQueue);
    }
    
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  // Delete item
  const handleDelete = async (item: MegaItem) => {
    if (item.isFolder && HIDDEN_FOLDERS.includes(item.name)) {
      setError(`Cannot delete system protected folder: ${item.name}`);
      return;
    }
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      if (item.isFolder) {
        await megaService.deleteFolder(item.path);
      } else {
        await megaService.deleteFile(currentPath, item.name);
      }
      
      await Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      loadFolder(currentPath);
    } catch (err: any) {
      setError(err.message);
      Swal.fire('Error!', err.message, 'error');
    }
  };

  // Download file - Updated to use ProgressPopup
  const handleDownloadFile = (item: MegaItem) => {
    if (item.isFolder) {
      setError('Cannot download folders. Please use the share link option.');
      return;
    }
    
    setDownloadPopup({
      show: true,
      file: {
        name: item.name,
        path: item.path || currentPath,
        size: item.size,
        mime: item.type || 'application/octet-stream' // Using type instead of mime
      }
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.blur();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'f') || (e.key === '/' && !e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && searchTerm) {
        clearSearch();
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);

  // Filter items based on search
  const filteredItems = items.filter((item: MegaItem) => {
    if (item.isFolder && HIDDEN_FOLDERS.includes(item.name)) {
      return false;
    }
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort items: folders first, then files
  const sortedItems = [...filteredItems].sort((a: MegaItem, b: MegaItem) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div 
      ref={dropZoneRef}
      className="relative h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-2 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 flex-shrink-0">
            <BookOpen size={16} className="text-green-950" />
          </div>
          <span className="text-white font-bold text-sm truncate">Library</span>
        </div>
        <ProfileButton />
      </div>

      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/10 border-4 border-dashed border-yellow-400 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-4">
            <FileUp size={48} className="sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Drop Files & Folders</h3>
            <p className="text-green-100 text-sm sm:text-base">
              Drop your files and folders here to upload them to the current location
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400 text-xs sm:text-sm">
              <Folder size={16} />
              <span>Folders supported with structure</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Library"
        description="Manage your files and folders - Drag & drop to upload"
        Icon={BookOpen}
      />

      {/* Toolbar */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={navigateUp}
            disabled={!currentPath}
            className="p-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => loadFolder(currentPath)}
            className="p-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex-shrink-0"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center gap-1 text-xs sm:text-sm text-green-100 overflow-x-auto flex-1 min-w-0 pb-1">
            <button
              onClick={() => navigateToFolder('')}
              className="hover:text-yellow-400 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Root
            </button>
            {breadcrumb.map((crumb, index) => {
              if (HIDDEN_FOLDERS.includes(crumb.name)) {
                return null;
              }
              return (
                <span key={index} className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  <span className="text-green-300">/</span>
                  <button
                    onClick={() => navigateToFolder(crumb.path)}
                    className="hover:text-yellow-400 transition-colors truncate max-w-[40px] sm:max-w-[100px] md:max-w-[150px]"
                  >
                    {crumb.name}
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none min-w-[120px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-w-0 pl-9 pr-8 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-200/60 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex bg-white/10 border border-white/20 rounded-xl p-1 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-yellow-400 text-green-950' : 'text-white hover:bg-white/10'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-yellow-400 text-green-950' : 'text-white hover:bg-white/10'
              }`}
            >
              <List size={16} />
            </button>
          </div>

          <button
            onClick={() => setShowNewFolderModal(true)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-1 text-sm flex-shrink-0"
          >
            <FolderPlus size={16} />
            <span className="hidden xs:inline">New</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-1 text-sm flex-shrink-0"
          >
            <Upload size={16} />
            <span className="hidden xs:inline">Upload</span>
          </button>
          
          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-1 text-sm flex-shrink-0"
            title="Upload Folder"
          >
            <FolderUp size={16} />
            <span className="hidden sm:inline">Folder</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore - webkitdirectory is valid
            webkitdirectory="true"
            multiple
            onChange={handleFolderUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress !== null && (
        <div className="mt-4 p-3 sm:p-4 bg-white/10 border border-white/20 rounded-xl animate-slide-up">
          <div className="flex items-center justify-between text-white mb-2">
            <span className="truncate mr-2 text-sm">
              {uploadQueue.length > 1 
                ? `Uploading ${uploadQueue.length} files...`
                : uploadFileName || 'Uploading...'
              }
            </span>
            <span className="text-sm font-medium flex-shrink-0">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          {uploadQueue.length > 1 && (
            <div className="text-xs text-green-200 mt-1">
              {Math.round((uploadProgress / 100) * uploadQueue.length)} / {uploadQueue.length} files
            </div>
          )}
          {uploadFileName && uploadQueue.length > 1 && (
            <div className="text-xs text-green-200 mt-0.5 truncate">
              Current: {uploadFileName}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 text-yellow-400 hover:text-yellow-300 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Files Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-yellow-400 border-t-transparent" />
        </div>
      ) : (
        <div className={`mt-4 sm:mt-6 w-full ${
          viewMode === 'grid'
            ? 'grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4'
            : 'space-y-2'
        }`}>
          {sortedItems.length === 0 ? (
            <div className="col-span-full text-center py-8 sm:py-12 text-green-100">
              <FolderOpen size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No files or folders found</p>
              <p className="text-xs sm:text-sm text-green-200 mt-2">
                {searchTerm ? (
                  <>
                    No results for "<span className="text-yellow-400">{searchTerm}</span>"
                    <button
                      onClick={clearSearch}
                      className="block mt-2 text-yellow-400 hover:text-yellow-300 underline"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  'Drop files here or use the upload button'
                )}
              </p>
            </div>
          ) : (
            sortedItems.map((item) => (
              <div
                key={item.name}
                className={`group relative ${
                  viewMode === 'grid'
                    ? 'flex flex-col items-center justify-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4 hover:scale-105 transition-all duration-300 cursor-pointer min-h-[140px] sm:min-h-[160px]'
                    : 'flex items-center gap-3 sm:gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-2 sm:p-3 hover:bg-white/20 transition-all'
                }`}
                onClick={() => {
                  if (item.isFolder) {
                    navigateToFolder(item.path);
                  }
                }}
              >
                {/* Icon */}
                <div className={viewMode === "grid" ? "flex justify-center items-center w-full mb-2 sm:mb-3" : "flex-shrink-0 flex justify-center items-center"}>
                  <FileIcon
                    fileName={item.name}
                    isFolder={item.isFolder}
                    size={viewMode === "grid" ? 40 : 24}
                  />
                </div>

                {/* Info */}
                <div className={viewMode === "grid" ? "flex flex-col items-center text-center w-full min-w-0" : "flex-1 min-w-0"}>
                  <div className="text-white font-medium text-xs sm:text-sm truncate w-full">
                    {item.name}
                  </div>
                  {!item.isFolder && (
                    <div className="text-green-200 text-[10px] sm:text-xs">
                      {formatFileSize(item.size)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className={`${
                  viewMode === 'grid'
                    ? 'absolute top-1 right-1 flex flex-row gap-0.5 bg-black/40 backdrop-blur-sm rounded-lg p-0.5 sm:p-1 sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity'
                    : 'flex-shrink-0 flex gap-1'
                }`}>
                  {/* Only show download button for files (not folders) */}
                  {!item.isFolder && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(item);
                      }}
                      className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                      title="Download"
                    >
                      <Download size={12} />
                    </button>
                  )}
                  
                  {/* Delete button for both files and folders */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="p-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-8 max-w-md w-full mx-4">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4 text-sm sm:text-base"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
                className="flex-1 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all text-sm sm:text-base"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Progress Popup */}
      {downloadPopup.show && downloadPopup.file.name && (
        <ProgressPopup
          file={downloadPopup.file}
          onClose={() => {
            setDownloadPopup({ show: false, file: { name: '', path: '' } });
          }}
          onComplete={() => {
            console.log('✅ Download complete for:', downloadPopup.file.name);
          }}
          autoDownload={true}
        />
      )}
    </div>
  );
}