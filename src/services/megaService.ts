// src/services/megaService.ts
import ApiRoutes from './ApiRoutes';
import { getAuthHeaders, getAuthToken } from '../config/api';
import type { MegaFolder } from '../types/mega.types';

export const megaService = {
  // Get folder contents
  async getFolder(path: string = ''): Promise<MegaFolder> {
    try {
      const response = await fetch(ApiRoutes.megaGetFolder(path), {
        headers: getAuthHeaders(),
      });
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

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(ApiRoutes.megaUploadFile(), {
      method: 'POST',
      headers: headers,
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify({ path }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete folder');
    }
    return data;
  },

  // Download file with proper authentication
  async downloadFile(path: string, name: string): Promise<void> {
    try {
      const url = ApiRoutes.megaDownloadFile(path, name);
      console.log('📥 Downloading file from:', url);
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('UNAUTHORIZED: Please login again');
        }
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

  // Get folder share link
  async getFolderShareLink(path: string): Promise<any> {
    try {
      const response = await fetch(ApiRoutes.megaFolderShareLink(path), {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get share link');
      }
      return data;
    } catch (error: any) {
      console.error('❌ Get share link error:', error);
      throw new Error(error.message || 'Failed to get share link');
    }
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

      // Get token and set Authorization header
      const token = getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

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
};