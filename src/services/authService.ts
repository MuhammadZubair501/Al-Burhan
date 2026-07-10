import ApiRoutes from './ApiRoutes';
import { getAuthHeaders, setAuthToken, removeAuthToken, getAuthToken } from '../config/api';

// ============================================
// GENERIC TIME CONFIGURATION - Days, Hours, Minutes
// ============================================
interface TimeConfig {
  minutes: number;
  ms: number;
  label: string;
  days: number;
  hours: number;
  minutesPart: number;
}

const parseTimeConfig = (days: number, hours: number, minutes: number, defaultMinutes: number = 20): TimeConfig => {
  const d = days || 0;
  const h = hours || 0;
  const m = minutes || 0;
  
  const totalMinutes = (d * 24 * 60) + (h * 60) + m;
  
  if (totalMinutes === 0) {
    return {
      minutes: defaultMinutes,
      ms: defaultMinutes * 60 * 1000,
      label: `${defaultMinutes} minute${defaultMinutes > 1 ? 's' : ''}`,
      days: 0,
      hours: 0,
      minutesPart: defaultMinutes
    };
  }
  
  let labelParts = [];
  if (d > 0) labelParts.push(`${d} day${d > 1 ? 's' : ''}`);
  if (h > 0) labelParts.push(`${h} hour${h > 1 ? 's' : ''}`);
  if (m > 0) labelParts.push(`${m} minute${m > 1 ? 's' : ''}`);
  const label = labelParts.join(' ');
  
  return {
    minutes: totalMinutes,
    ms: totalMinutes * 60 * 1000,
    label: label,
    days: d,
    hours: h,
    minutesPart: m
  };
};

// Get session duration from environment
const SESSION = parseTimeConfig(
  parseInt(import.meta.env.VITE_SESSION_DAYS || '0'),
  parseInt(import.meta.env.VITE_SESSION_HOURS || '0'),
  parseInt(import.meta.env.VITE_SESSION_MINUTES || '0'),
  20 // Default: 20 minutes
);

// Get warning duration from environment
const WARNING = parseTimeConfig(
  parseInt(import.meta.env.VITE_SESSION_WARNING_DAYS || '0'),
  parseInt(import.meta.env.VITE_SESSION_WARNING_HOURS || '0'),
  parseInt(import.meta.env.VITE_SESSION_WARNING_MINUTES || '0'),
  3 // Default: 3 minutes
);

console.log(`🔐 Session duration: ${SESSION.label}`);
console.log(`⚠️ Warning at: ${WARNING.label} before expiry`);

export interface LoginCredentials {
  email_address: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      userId: number;
      email: string;
      role: string;
    };
    token: string;
    expiresIn?: number;
    sessionLabel?: string;
    sessionDetails?: {
      days: number;
      hours: number;
      minutes: number;
    };
  };
  error?: string;
}

export interface UserProfile {
  user_id: number;
  email_address: string;
  role: string;
}

export const authService = {
  // Login user with remember me support
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      if (!credentials.email_address || !credentials.password) {
        return {
          success: false,
          message: 'Email and password are required',
          error: 'MISSING_CREDENTIALS'
        };
      }

      const response = await fetch(ApiRoutes.login(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.data?.token) {
        setAuthToken(data.data.token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        localStorage.setItem('loginTime', Date.now().toString());
        
        // Store session label for display
        if (data.data.sessionLabel) {
          localStorage.setItem('sessionLabel', data.data.sessionLabel);
        } else {
          localStorage.setItem('sessionLabel', SESSION.label);
        }
        
        // Store session details
        if (data.data.sessionDetails) {
          localStorage.setItem('sessionDetails', JSON.stringify(data.data.sessionDetails));
        } else {
          localStorage.setItem('sessionDetails', JSON.stringify({
            days: SESSION.days,
            hours: SESSION.hours,
            minutes: SESSION.minutesPart
          }));
        }
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error occurred. Please check your connection.',
        error: 'NETWORK_ERROR'
      };
    }
  },

  // Logout user - clear all stored data
  logout: (): void => {
    removeAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('sessionLabel');
    localStorage.removeItem('sessionDetails');
  },

  // Clear all stored data including remember me
  clearAllStoredData: (): void => {
    removeAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('sessionLabel');
    localStorage.removeItem('sessionDetails');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('rememberMe');
  },

  // Extend session
  extendSession: async (): Promise<{ 
    success: boolean; 
    token?: string; 
    expiresIn?: number; 
    sessionLabel?: string;
    sessionDetails?: any;
    error?: string 
  }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(ApiRoutes.extendSession(), {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        setAuthToken(data.token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        localStorage.setItem('loginTime', Date.now().toString());
        
        if (data.sessionLabel) {
          localStorage.setItem('sessionLabel', data.sessionLabel);
        }
        
        if (data.sessionDetails) {
          localStorage.setItem('sessionDetails', JSON.stringify(data.sessionDetails));
        }
      }
      
      return data;
    } catch (error) {
      console.error('Extend session error:', error);
      return { success: false, error: 'NETWORK_ERROR' };
    }
  },

  // Check session status
  checkSessionStatus: (): { isValid: boolean; remainingTime: number } => {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) {
      return { isValid: false, remainingTime: 0 };
    }

    const elapsed = Date.now() - parseInt(loginTime);
    const maxAge = SESSION.ms;
    const remainingTime = Math.max(0, maxAge - elapsed);
    
    return {
      isValid: remainingTime > 0,
      remainingTime: remainingTime
    };
  },

  // ============================================
  // SESSION HELPER METHODS - ADDED
  // ============================================
  
  // Get session label for display
  getSessionLabel: (): string => {
    const label = localStorage.getItem('sessionLabel');
    return label || SESSION.label;
  },

  // Get session details
  getSessionDetails: (): { days: number; hours: number; minutes: number } => {
    try {
      const details = localStorage.getItem('sessionDetails');
      if (details) {
        return JSON.parse(details);
      }
    } catch (error) {
      console.error('Error parsing session details:', error);
    }
    return {
      days: SESSION.days,
      hours: SESSION.hours,
      minutes: SESSION.minutesPart
    };
  },

  // Get session duration in milliseconds
  getSessionDurationMs: (): number => {
    return SESSION.ms;
  },

  // Get warning duration in milliseconds
  getWarningDurationMs: (): number => {
    return WARNING.ms;
  },

  // Get session duration label
  getSessionDurationLabel: (): string => {
    return SESSION.label;
  },

  // Get warning duration label
  getWarningDurationLabel: (): string => {
    return WARNING.label;
  },

  // ============================================
  // END SESSION HELPER METHODS
  // ============================================

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; data?: { user: UserProfile }; error?: string }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found'
        };
      }

      const response = await fetch(ApiRoutes.profile(), {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'NETWORK_ERROR'
      };
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      if (!currentPassword || !newPassword) {
        return {
          success: false,
          error: 'Both current and new password are required'
        };
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          error: 'New password must be at least 6 characters long'
        };
      }

      const response = await fetch(ApiRoutes.changePassword(), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'NETWORK_ERROR'
      };
    }
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<{ success: boolean; data?: { user: UserProfile }; message?: string; error?: string }> => {
    try {
      if (!email) {
        return {
          success: false,
          error: 'Email is required'
        };
      }

      const response = await fetch(ApiRoutes.getUserByEmail(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      console.error('Get user by email error:', error);
      return {
        success: false,
        error: 'NETWORK_ERROR'
      };
    }
  },

  // Reset password
  resetPassword: async (email: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      if (!email || !newPassword) {
        return {
          success: false,
          error: 'Email and new password are required'
        };
      }

      if (newPassword.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
      }

      const response = await fetch(ApiRoutes.resetPassword(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'NETWORK_ERROR'
      };
    }
  },

  // Check if user is authenticated and session is valid
  isAuthenticated: (): boolean => {
    const token = getAuthToken();
    if (!token) return false;
    
    const sessionStatus = authService.checkSessionStatus();
    return sessionStatus.isValid;
  },

  // Get current user role
  getUserRole: (): string | null => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Get current user ID
  getUserId: (): number | null => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};