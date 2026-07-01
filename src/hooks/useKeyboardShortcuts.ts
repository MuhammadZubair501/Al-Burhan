// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

export function useKeyboardShortcuts({
  onSearch,
  onUpload,
  onNewFolder,
  onRefresh,
}: {
  onSearch?: () => void;
  onUpload?: () => void;
  onNewFolder?: () => void;
  onRefresh?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+U = Upload
      if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        e.preventDefault();
        onUpload?.();
      }
      // Ctrl+Shift+N = New Folder
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        onNewFolder?.();
      }
      // Ctrl+R = Refresh
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        onRefresh?.();
      }
      // Ctrl+F = Focus Search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        onSearch?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onUpload, onNewFolder, onRefresh]);
}