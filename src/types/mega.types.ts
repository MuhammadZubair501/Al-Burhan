// src/types/mega.types.ts
export interface MegaItem {
  name: string;
  isFolder: boolean;
  size: number;
  type: 'file' | 'folder';
  path: string;
}

export interface MegaFolder {
  path: string;
  breadcrumb: Breadcrumb[];
  items: MegaItem[];
}

export interface Breadcrumb {
  name: string;
  path: string;
}

export interface MegaProgress {
  status: 'starting' | 'running' | 'complete' | 'failed' | 'not_found';
  fileName: string;
  percentage: number;
  speedMbps: string;  // Added this property
  loadedMB: string;
  totalMB: string;
  remainingMB: string;
  etaSeconds: number;
  completedFiles: number;
  totalFiles: number;
  error?: string | null;
  message?: string;
}

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}