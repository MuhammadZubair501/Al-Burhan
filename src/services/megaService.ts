// src/services/megaService.ts
import ApiRoutes from './ApiRoutes';
import type { MegaFolder } from '../types/mega.types';

export const megaService = {
  // Get folder contents
  async getFolder(path: string = ''): Promise<MegaFolder> {
    const response = await fetch(ApiRoutes.megaGetFolder(path));
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch folder contents');
    }
    return data;
  },

  // Upload file
  async uploadFile(file: File, path: string = ''): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await fetch(ApiRoutes.megaUploadFile(), {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload file');
    }
    return data;
  },

  // Create folder
  async createFolder(path: string, name: string): Promise<any> {
    const response = await fetch(ApiRoutes.megaCreateFolder(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, name }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create folder');
    }
    return data;
  },

  // Delete file
  async deleteFile(path: string, name: string): Promise<any> {
    const response = await fetch(ApiRoutes.megaDeleteFile(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path, name }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete file');
    }
    return data;
  },

  // Delete folder
  async deleteFolder(path: string): Promise<any> {
    const response = await fetch(ApiRoutes.megaDeleteFolder(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete folder');
    }
    return data;
  },

  // Download file with proper handling
  async downloadFile(path: string, name: string): Promise<void> {
    try {
      const url = ApiRoutes.megaDownloadFile(path, name);
      console.log('Downloading file from:', url);
      
      // Fetch the file
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get the filename from Content-Disposition header or use provided name
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = name;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      // Create blob from response
      const blob = await response.blob();
      
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
      
      console.log('File downloaded successfully:', filename);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // Start folder download
  async downloadFolder(path: string): Promise<{ jobId: string }> {
    const response = await fetch(ApiRoutes.megaDownloadFolder(path));
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to start folder download');
    }
    return data;
  },

  // Get ZIP download URL
  getZipDownloadUrl(jobId: string): string {
    return ApiRoutes.megaDownloadZip(jobId);
  },

  // Get progress stream
  getProgressStream(jobId: string): EventSource {
    const url = ApiRoutes.megaProgress(jobId);
    return new EventSource(url);
  },

  // Upload file with progress
  async uploadFileWithProgress(
    file: File,
    path: string = '',
    onProgress: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', ApiRoutes.megaUploadFile());

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(formData);
    });
  },

  // Get job status
  async getJobStatus(jobId: string): Promise<any> {
    const response = await fetch(`${ApiRoutes.megaProgress}/status/${jobId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get job status');
    }
    return data;
  }
};