// src/components/Mega/ProgressPopup.tsx
import { useEffect, useState } from 'react';
import { X, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { megaService } from '../../services/megaService';
import type { MegaProgress } from '../../types/mega.types';

interface ProgressPopupProps {
  jobId: string;
  onClose: () => void;
  onComplete: (jobId: string) => void;
  autoDownload?: boolean;
}

export default function ProgressPopup({ 
  jobId, 
  onClose, 
  onComplete, 
  autoDownload = false 
}: ProgressPopupProps) {
  const [progress, setProgress] = useState<MegaProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  useEffect(() => {
    console.log(`Connecting to progress stream for job: ${jobId}`);
    const es = megaService.getProgressStream(jobId);
    setEventSource(es);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Progress update:', data);
        setProgress(data);

        if (data.status === 'complete') {
          setIsComplete(true);
          console.log('Download complete!');
          
          // Auto-download if enabled
          if (autoDownload && !downloadTriggered) {
            setDownloadTriggered(true);
            setTimeout(() => {
              handleDownloadZip();
            }, 1000);
          }
        }

        if (data.status === 'failed') {
          setError(data.error || data.message || 'Download failed');
          console.error('Download failed:', data.error);
          es.close();
        }

        if (data.status === 'not_found') {
          setError('Job not found');
          es.close();
        }
      } catch (err) {
        console.error('Error parsing progress:', err);
      }
    };

    es.onerror = (event) => {
      console.error('EventSource error:', event);
      // Only set error if not complete
      if (!isComplete) {
        setError('Connection to progress stream lost. Please try again.');
      }
      es.close();
    };

    return () => {
      console.log('Closing progress stream');
      es.close();
    };
  }, [jobId, autoDownload, downloadTriggered]);

  const handleDownloadZip = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const url = megaService.getZipDownloadUrl(jobId);
      console.log('Downloading ZIP from:', url);
      
      // Fetch the file with proper headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/zip, application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get the filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `folder-${jobId}.zip`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 1000);
      
      console.log('Download started successfully');
      
      // Close after download starts
      setTimeout(() => {
        onClose();
        onComplete(jobId);
      }, 2000);
      
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download ZIP file');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancel = () => {
    if (eventSource) {
      eventSource.close();
    }
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    setProgress(null);
    setIsComplete(false);
    setDownloadTriggered(false);
    // Try to reconnect
    const es = megaService.getProgressStream(jobId);
    setEventSource(es);
  };

  // Format file size
  const formatSize = (mb: string) => {
    const num = parseFloat(mb);
    if (isNaN(num)) return '0 MB';
    if (num >= 1024) {
      return `${(num / 1024).toFixed(2)} GB`;
    }
    return `${num.toFixed(2)} MB`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-full animate-slide-up">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {error ? (
              <AlertCircle className="text-red-400" size={24} />
            ) : isComplete ? (
              <CheckCircle className="text-green-400" size={24} />
            ) : progress?.status === 'running' ? (
              <Loader2 className="text-yellow-400 animate-spin" size={24} />
            ) : (
              <Loader2 className="text-yellow-400 animate-spin" size={24} />
            )}
            <div>
              <h3 className="text-white font-semibold">
                {error ? 'Error' : isComplete ? 'Download Complete' : 'Downloading...'}
              </h3>
              <p className="text-green-100 text-sm truncate max-w-[200px]">
                {progress?.fileName || 'Preparing...'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-green-100 hover:text-white transition-colors"
            disabled={isDownloading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        {!error && progress && progress.status === 'running' && (
          <div className="space-y-3">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(progress.percentage, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-green-100">
              <span>{Math.min(progress.percentage, 100)}%</span>
              <span>
                {formatSize(progress.loadedMB)} / {formatSize(progress.totalMB)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-green-100">
              <div>
                <span className="text-green-300">Speed:</span> {progress.speedMbps || '0'} MB/s
              </div>
              <div>
                <span className="text-green-300">ETA:</span> {progress.etaSeconds || 0}s
              </div>
              <div className="col-span-2">
                <span className="text-green-300">Files:</span> {progress.completedFiles || 0}/{progress.totalFiles || 0}
              </div>
            </div>
          </div>
        )}

        {/* Complete Message */}
        {!error && isComplete && progress && (
          <div className="space-y-3">
            <div className="text-green-400 text-sm bg-green-400/10 p-3 rounded-xl text-center">
              <CheckCircle size={20} className="inline mr-2" />
              Download completed successfully!
            </div>
            <div className="text-xs text-green-100 text-center">
              Total size: {formatSize(progress.totalMB)} | Files: {progress.totalFiles}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl">
            {error}
            <button
              onClick={handleRetry}
              className="ml-2 text-yellow-400 hover:text-yellow-300 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Download Button */}
        {isComplete && !downloadTriggered && (
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className={`mt-4 w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              isDownloading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105'
            }`}
          >
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={18} />
                Download ZIP ({formatSize(progress?.totalMB || '0')})
              </>
            )}
          </button>
        )}

        {/* Auto-download status */}
        {isComplete && downloadTriggered && isDownloading && (
          <div className="mt-4 text-center text-green-100 text-sm">
            <Loader2 size={18} className="inline animate-spin mr-2" />
            Starting download...
          </div>
        )}
      </div>
    </div>
  );
}