// export const BASE_URL = "http://localhost:5000/";
// export const API_BASE_URL = "http://localhost:5000/api";
export const BASE_URL = "http://192.9.210.50:5000/";
export const API_BASE_URL = "http://192.9.210.50:5000/api";

// export const BASE_URL = "https://alburhan-backend-production.up.railway.app";
// export const API_BASE_URL = "https://alburhan-backend-production.up.railway.app/api";

// Get session duration from environment
const SESSION_DURATION_MINUTES = parseInt(import.meta.env.VITE_SESSION_DURATION_MINUTES) || 20;
const SESSION_DURATION_MS = SESSION_DURATION_MINUTES * 60 * 1000;

// Auth token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
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

// Session management - Uses env variable
export const isTokenExpired = (): boolean => {
  const timestamp = localStorage.getItem('tokenTimestamp');
  if (!timestamp) return true;
  
  const tokenAge = Date.now() - parseInt(timestamp);
  return tokenAge > SESSION_DURATION_MS;
};

export const refreshSession = (): void => {
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};