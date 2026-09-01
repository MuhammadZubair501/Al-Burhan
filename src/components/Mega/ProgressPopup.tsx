// src/components/Mega/ProgressPopup.tsx
import { useState, useEffect, useRef } from 'react';
import { X, Download, Loader2, AlertCircle } from 'lucide-react';
import { megaService } from '../../services/megaService';

interface ProgressPopupProps {
  jobId: string;
  onClose: () => void;
  onComplete?: (jobId: string) => void;
  autoDownload?: boolean;
}

export default function ProgressPopup({ jobId, onClose, onComplete, autoDownload = true }: ProgressPopupProps) {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('processing');
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [completedFiles, setCompletedFiles] = useState<number>(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  // Validate jobId
  if (!jobId || jobId === 'undefined' || jobId === 'null' || jobId === '') {
    console.error('❌ ProgressPopup received invalid jobId:', jobId);
    return (
      <div className="fixed bottom-4 right-4 z-50 w-80 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl p-4 animate-slide-up">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <div>
              <h4 className="text-white font-medium text-sm">Invalid Job</h4>
              <p className="text-red-300 text-xs">No valid job ID provided</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log(`📡 ProgressPopup: Connecting to job ${jobId}`);

    // Function to connect to SSE
    const connectSSE = () => {
      try {
        // Close existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        console.log(`📡 Connecting to progress stream for job: ${jobId} (attempt ${retryCountRef.current + 1})`);
        const eventSource = megaService.getProgressStream(jobId);
        eventSourceRef.current = eventSource;
        
        eventSource.onopen = () => {
          console.log(`✅ SSE connection established for job: ${jobId}`);
          retryCountRef.current = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log(`📊 Progress data for ${jobId}:`, data);
            
            if (data.status === 'complete') {
              setProgress(100);
              setStatus('complete');
              setTotalFiles(data.totalFiles || 0);
              setCompletedFiles(data.completedFiles || 0);
              if (autoDownload) {
                handleDownload();
              }
              if (onComplete) {
                onComplete(jobId);
              }
              eventSource.close();
            } else if (data.status === 'failed') {
              setStatus('failed');
              setError(data.error || 'Download failed');
              eventSource.close();
            } else if (data.status === 'not_found') {
              setStatus('failed');
              setError('Job not found. Please try again.');
              eventSource.close();
            } else if (data.percentage !== undefined) {
              setProgress(Math.min(data.percentage, 100));
              setStatus(data.status || 'processing');
              setTotalFiles(data.totalFiles || 0);
              setCompletedFiles(data.completedFiles || 0);
            }
          } catch (err) {
            console.error('Error parsing progress data:', err);
          }
        };

        eventSource.onerror = (error) => {
          console.error(`❌ EventSource error for job ${jobId}:`, error);
          
          // Check if the connection was closed intentionally
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            console.log('SSE connection closed');
            return;
          }
          
          // Retry connection
          retryCountRef.current++;
          console.log(`🔄 Retrying connection (${retryCountRef.current}/${maxRetries})...`);
          
          // Close the old connection
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          
          // Try to reconnect after a delay
          setTimeout(() => {
            if (retryCountRef.current < maxRetries && status !== 'complete') {
              connectSSE();
            } else {
              setError('Connection lost. Please try again.');
              setStatus('failed');
            }
          }, 2000);
        };
      } catch (err: any) {
        console.error('Error creating EventSource:', err);
        setError(err.message || 'Failed to connect');
        setStatus('failed');
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        console.log(`🧹 Closing EventSource for job ${jobId}`);
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [jobId]);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const url = megaService.getZipDownloadUrl(jobId);
      console.log('📥 Downloading ZIP from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download ZIP file');
      }
      
      const blob = await response.blob();
      const link = document.createElement('a');
      const urlObject = URL.createObjectURL(blob);
      link.href = urlObject;
      link.download = `folder-${jobId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(urlObject);
      }, 5000);
      
      console.log('✅ ZIP downloaded successfully');
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium text-sm">
          {status === 'complete' ? 'Download Complete' : 
           status === 'failed' ? 'Download Failed' : 
           'Downloading Folder...'}
        </h4>
        <button onClick={onClose} className="text-white/60 hover:text-white transition">
          <X size={16} />
        </button>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-300 ${
            status === 'complete' ? 'bg-green-500' : 
            status === 'failed' ? 'bg-red-500' : 
            'bg-gradient-to-r from-yellow-400 to-amber-500'
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{Math.min(progress, 100)}%</span>
        <span>
          {status === 'complete' ? '✅ Done' : 
           status === 'failed' ? '❌ Failed' : 
           totalFiles > 0 ? `${completedFiles}/${totalFiles} files` : 
           '⏳ Processing...'}
        </span>
      </div>

      {error && (
        <div className="mt-2 text-xs text-red-300 bg-red-500/20 p-2 rounded-lg flex items-start gap-2">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {status === 'complete' && (
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-3 w-full py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:hover:scale-100"
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={16} />
              Download ZIP
            </>
          )}
        </button>
      )}
    </div>
  );
}