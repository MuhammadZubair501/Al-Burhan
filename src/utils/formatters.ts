// src/utils/formatters.ts - Enhanced version
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return size + ' ' + sizes[i];
}

export function formatMBToReadable(mb: string | number): string {
  const num = typeof mb === 'string' ? parseFloat(mb) : mb;
  if (isNaN(num)) return '0 MB';
  if (num >= 1024) {
    return `${(num / 1024).toFixed(2)} GB`;
  }
  return `${num.toFixed(2)} MB`;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}