// src/services/megaService.ts
import ApiRoutes from './ApiRoutes';
import type { MegaFolder } from '../types/mega.types';

export const megaService = {
  // Get folder contents
  async getFolder(path: string = ''): Promise<MegaFolder> {
    try {
      const response = await fetch(ApiRoutes.megaGetFolder(path));
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch folder contents');
      }
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching folder:', error);
      throw new Error(error.message || 'Failed to load folder');
    }
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
      console.log('📥 Downloading file from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Download failed: ${response.statusText}`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = name;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = decodeURIComponent(match[1]);
        }
      }

      const blob = await response.blob();
      
      const link = document.createElement('a');
      const urlObject = URL.createObjectURL(blob);
      link.href = urlObject;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(urlObject);
      }, 5000);
      
      console.log('✅ File downloaded successfully:', filename);
    } catch (error: any) {
      console.error('❌ Download error:', error);
      throw new Error(error.message || 'Failed to download file');
    }
  },



  // Get ZIP download URL
  getZipDownloadUrl(jobId: string): string {
    return ApiRoutes.megaDownloadZip(jobId);
  },

  // Get progress stream
  getProgressStream(jobId: string): EventSource {
    if (!jobId || jobId === 'undefined' || jobId === 'null') {
      console.error('❌ Cannot create EventSource: invalid jobId:', jobId);
      throw new Error('Invalid job ID');
    }
    const url = ApiRoutes.megaProgress(jobId);
    console.log(`📡 Creating EventSource for: ${url}`);
    
    const eventSource = new EventSource(url, {
      withCredentials: true
    });
    
    eventSource.onopen = () => {
      console.log('✅ EventSource connection opened');
    };
    
    eventSource.onerror = (error) => {
      console.error('❌ EventSource error:', error);
      console.error('  - readyState:', eventSource.readyState);
      console.error('  - url:', url);
    };
    
    return eventSource;
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
          const progress = Math.min(Math.round((event.loaded / event.total) * 100), 100);
          onProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            resolve(JSON.parse(xhr.response));
          } catch {
            resolve({ success: true, message: 'Upload complete' });
          }
        } else {
          let errorMessage = 'Upload failed';
          try {
            const data = JSON.parse(xhr.response);
            errorMessage = data.error || data.message || 'Upload failed';
          } catch {
            errorMessage = `Upload failed with status ${xhr.status}`;
          }
          reject(new Error(errorMessage));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.ontimeout = () => reject(new Error('Upload timeout'));
      xhr.timeout = 600000;
      xhr.send(formData);
    });
  },

  // Get job status
  async getJobStatus(jobId: string): Promise<any> {
    if (!jobId || jobId === 'undefined' || jobId === 'null') {
      throw new Error('Invalid job ID');
    }
    const response = await fetch(`${ApiRoutes.MEGA_PROGRESS}/status/${jobId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get job status');
    }
    return data;
  },// src/services/megaService.ts - Add these methods

// Get folder info without downloading
async getFolderInfo(path: string): Promise<{
  success: boolean;
  folderName: string;
  fileCount: number;
  totalSize: number;
  files: Array<{
    name: string;
    path: string;
    size: number;
    mime: string;
  }>;
}> {
  try {
    const url = ApiRoutes.megaFolderInfo(path);
    console.log('📁 Getting folder info from:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get folder info');
    }
    
    return data;
  } catch (error: any) {
    console.error('❌ Get folder info error:', error);
    throw new Error(error.message || 'Failed to get folder information');
  }
},


};