// export const BASE_URL = "http://localhost:5000/";
// export const API_BASE_URL = "http://localhost:5000/api";
export const BASE_URL = "http://192.9.210.50:5000/";
export const API_BASE_URL = "http://192.9.210.50:5000/api";

// export const BASE_URL = "https://alburhan-backend-production.up.railway.app";
// export const API_BASE_URL = "https://alburhan-backend-production.up.railway.app/api";


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

// Session management
export const isTokenExpired = (): boolean => {
  const timestamp = localStorage.getItem('tokenTimestamp');
  if (!timestamp) return true;
  
  // Check if token is older than 7 days (or your token expiry time)
  const tokenAge = Date.now() - parseInt(timestamp);
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  return tokenAge > maxAge;
};

export const refreshSession = (): void => {
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};;