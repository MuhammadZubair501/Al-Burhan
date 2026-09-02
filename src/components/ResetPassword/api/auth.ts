// config/api.ts

// ============================================
// BASE URL CONFIGURATION
// ============================================

// Local Development
// export const BASE_URL = "http://localhost:5000";
// export const API_BASE_URL = "http://localhost:5000/api";

// Production (uncomment when deploying)
export const BASE_URL = "https://alburhan-backend-lyart.vercel.app";
export const API_BASE_URL = "https://alburhan-backend-lyart.vercel.app/api";

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

// ============================================
// TEACHER/STUDENT IMAGE URL HELPERS
// ============================================

/**
 * Get the full image URL for a profile image
 */
export const getImageUrl = (imagePath: string | null | undefined, defaultImage: string = '/default-avatar.png'): string => {
  if (!imagePath) {
    return defaultImage;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  let cleanPath = imagePath.replace(/^\/+/, '');

  if (cleanPath.startsWith('profile_images/')) {
    return `${BASE_URL}/api/images/${cleanPath}`;
  }

  if (cleanPath.startsWith('students/') || cleanPath.startsWith('teachers/')) {
    return `${BASE_URL}/api/images/profile_images/${cleanPath}`;
  }

  if (cleanPath.includes('teacher')) {
    return `${BASE_URL}/api/images/profile_images/teachers/${cleanPath}`;
  }
  if (cleanPath.includes('student')) {
    return `${BASE_URL}/api/images/profile_images/students/${cleanPath}`;
  }

  return `${BASE_URL}/api/images/profile_images/students/${cleanPath}`;
};

export const getStudentImageUrl = (
  student: { profile_image_path?: string | null, first_name?: string, last_name?: string },
  defaultImage?: string
): string => {
  return getImageUrl(student?.profile_image_path, defaultImage);
};

export const getTeacherImageUrl = (
  teacher: { profile_image_path?: string | null, first_name?: string, last_name?: string },
  defaultImage?: string
): string => {
  return getImageUrl(teacher?.profile_image_path, defaultImage);
};

// ============================================
// CAMPUS ID HELPERS
// ============================================

export const getCampusId = (): number => {
  // Try to get from localStorage
  const storedCampusId = localStorage.getItem('userCampusId') || localStorage.getItem('CampusID');
  if (storedCampusId) {
    return parseInt(storedCampusId);
  }
  // Fallback to window
  if ((window as any).CampusID) {
    return parseInt((window as any).CampusID);
  }
  return 1; // Default campus
};