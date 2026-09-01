// src/components/Mega/ProgressPopup.tsx
import { useState, useEffect } from 'react';
import { X, Download, Loader2, AlertCircle, CheckCircle, FileIcon } from 'lucide-react';
import { megaService } from '../../services/megaService';

interface ProgressPopupProps {
  file: {
    name: string;
    path: string;
    size?: number;
    mime?: string;
  };
  onClose: () => void;
  onComplete?: () => void;
  autoDownload?: boolean;
}

export default function ProgressPopup({ 
  file, 
  onClose, 
  onComplete, 
  autoDownload = true 
}: ProgressPopupProps) {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'downloading' | 'complete' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [fileSize, setFileSize] = useState<string>('');

  // Format file size
  useEffect(() => {
    if (file.size) {
      const size = file.size;
      if (size < 1024) {
        setFileSize(`${size} B`);
      } else if (size < 1024 * 1024) {
        setFileSize(`${(size / 1024).toFixed(1)} KB`);
      } else if (size < 1024 * 1024 * 1024) {
        setFileSize(`${(size / (1024 * 1024)).toFixed(1)} MB`);
      } else {
        setFileSize(`${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`);
      }
    } else {
      setFileSize('Unknown size');
    }
  }, [file.size]);

  // Start download automatically
  useEffect(() => {
    if (autoDownload && file.name) {
      handleDownload();
    }
  }, [file]);

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setStatus('downloading');
    setError(null);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 300);

      console.log(`📥 Downloading file: ${file.name} from ${file.path || 'root'}`);
      
      await megaService.downloadFile(file.path || '', file.name);
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('complete');
      
      if (onComplete) {
        onComplete();
      }
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (err: any) {
      console.error('❌ Download error:', err);
      setError(err.message || 'Download failed');
      setStatus('failed');
      
      // Check if it's an auth error
      if (err.message.includes('UNAUTHORIZED') || err.message.includes('401')) {
        setError('Your session has expired. Please login again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileIcon = () => {
    if (!file.name) return <FileIcon size={24} className="text-white/60" />;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext || '')) {
      return <FileIcon size={24} className="text-purple-400" />;
    }
    // Video files
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(ext || '')) {
      return <FileIcon size={24} className="text-red-400" />;
    }
    // Audio files
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(ext || '')) {
      return <FileIcon size={24} className="text-green-400" />;
    }
    // Document files
    if (['pdf'].includes(ext || '')) {
      return <FileIcon size={24} className="text-red-500" />;
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return <FileIcon size={24} className="text-blue-400" />;
    }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileIcon size={24} className="text-green-500" />;
    }
    if (['ppt', 'pptx'].includes(ext || '')) {
      return <FileIcon size={24} className="text-orange-400" />;
    }
    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <FileIcon size={24} className="text-yellow-400" />;
    }
    
    return <FileIcon size={24} className="text-white/60" />;
  };

  // If no file name, show error
  if (!file || !file.name) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-80 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl p-4 animate-slide-up">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <div>
              <h4 className="text-white font-medium text-sm">Invalid File</h4>
              <p className="text-red-300 text-xs">No file selected for download</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            {status === 'complete' ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : status === 'failed' ? (
              <AlertCircle size={16} className="text-red-400" />
            ) : (
              getFileIcon()
            )}
          </div>
          <div>
            <h4 className="text-white font-medium text-sm">
              {status === 'complete' ? 'Download Complete' : 
               status === 'failed' ? 'Download Failed' : 
               'Downloading File...'}
            </h4>
            <p className="text-white/50 text-xs truncate max-w-[180px]">
              {file.name}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-white/40 hover:text-white transition p-1 rounded-full hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-300 ${
            status === 'complete' ? 'bg-green-500' : 
            status === 'failed' ? 'bg-red-500' : 
            'bg-gradient-to-r from-blue-400 to-purple-500'
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>
          {status === 'complete' ? '✅ Done' : 
           status === 'failed' ? '❌ Failed' : 
           `${Math.min(progress, 100)}%`}
        </span>
        <span>
          {status === 'downloading' && (
            <span className="flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Downloading...
            </span>
          )}
          {status === 'complete' && (
            <span className="text-green-400">Completed</span>
          )}
          {status === 'failed' && (
            <span className="text-red-400">Failed</span>
          )}
          {status === 'idle' && (
            <span>{fileSize}</span>
          )}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-xs text-red-300 bg-red-500/20 p-2 rounded-lg flex items-start gap-2">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </div>
      )}

      {/* Actions */}
      {status === 'failed' && (
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-3 w-full py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:hover:scale-100"
        >
          <Download size={16} />
          Retry Download
        </button>
      )}

      {status === 'complete' && (
        <div className="mt-3 text-center text-xs text-white/40">
          File downloaded successfully ✓
        </div>
      )}

      {status === 'idle' && !isDownloading && (
        <button
          onClick={handleDownload}
          className="mt-3 w-full py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Download size={16} />
          Start Download
        </button>
      )}
    </div>
  );
}