// config/api.ts

// ============================================
// BASE URL CONFIGURATION
// ============================================

// Local Development

export const BASE_URL = "https://alburhan-backend-lyart.vercel.app/";
export const API_BASE_URL = "https://alburhan-backend-lyart.vercel.app/api";


// export const BASE_URL = "http://localhost:5000";
// export const API_BASE_URL = "http://localhost:5000/api";


// ============================================
// SESSION CONFIGURATION
// ============================================

const SESSION_DURATION_MINUTES = parseInt(import.meta.env.VITE_SESSION_DURATION_MINUTES) || 20;
const SESSION_DURATION_MS = SESSION_DURATION_MINUTES * 60 * 1000;

// ============================================
// AUTH TOKEN MANAGEMENT
// ============================================

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenTimestamp');
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getFormDataHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ============================================
// SESSION MANAGEMENT
// ============================================

export const isTokenExpired = (): boolean => {
  const timestamp = localStorage.getItem('tokenTimestamp');
  if (!timestamp) return true;
  
  const tokenAge = Date.now() - parseInt(timestamp);
  return tokenAge > SESSION_DURATION_MS;
};

export const refreshSession = (): void => {
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};

// config/api.ts

// ... existing code ...

// ============================================
// TEACHER IMAGE URL HELPERS
// ============================================

/**
 * Get the full image URL for a profile image
 * @param imagePath - The path stored in database (e.g., "teachers/filename.jpg" or "students/filename.jpg")
 * @param defaultImage - Optional default image path
 * @returns Full URL to the image
 */
export const getImageUrl = (imagePath: string | null | undefined, defaultImage: string = '/default-avatar.png'): string => {
  // If no image path, return default
  if (!imagePath) {
    return defaultImage;
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Remove leading slashes if any
  let cleanPath = imagePath.replace(/^\/+/, '');

  // If path already contains 'profile_images', use as is with BASE_URL
  if (cleanPath.startsWith('profile_images/')) {
    return `${BASE_URL}/api/images/${cleanPath}`;
  }

  // If path starts with 'students/' or 'teachers/', add profile_images prefix
  if (cleanPath.startsWith('students/') || cleanPath.startsWith('teachers/')) {
    return `${BASE_URL}/api/images/profile_images/${cleanPath}`;
  }

  // Fallback: assume it's just a filename in the appropriate folder
  // Try to detect if it's a teacher or student image by checking the filename pattern
  if (cleanPath.includes('teacher')) {
    return `${BASE_URL}/api/images/profile_images/teachers/${cleanPath}`;
  }
  if (cleanPath.includes('student')) {
    return `${BASE_URL}/api/images/profile_images/students/${cleanPath}`;
  }

  // Default fallback - assume it's a student image
  return `${BASE_URL}/api/images/profile_images/students/${cleanPath}`;
};

/**
 * Get student image URL
 */
export const getStudentImageUrl = (
  student: { profile_image_path?: string | null, first_name?: string, last_name?: string },
  defaultImage?: string
): string => {
  return getImageUrl(student?.profile_image_path, defaultImage);
};

/**
 * Get teacher image URL
 */
export const getTeacherImageUrl = (
  teacher: { profile_image_path?: string | null, first_name?: string, last_name?: string },
  defaultImage?: string
): string => {
  return getImageUrl(teacher?.profile_image_path, defaultImage);
};