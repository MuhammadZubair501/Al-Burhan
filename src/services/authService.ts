import ApiRoutes from './ApiRoutes';
import { getAuthHeaders, setAuthToken, removeAuthToken, getAuthToken } from '../config/api';

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
    // Clear remember me data if you want to clear everything
    // localStorage.removeItem('rememberedEmail');
    // localStorage.removeItem('rememberedPassword');
    // localStorage.removeItem('rememberMe');
  },

  // Clear all stored data including remember me
  clearAllStoredData: (): void => {
    removeAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('rememberMe');
  },

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

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = getAuthToken();
    return !!token;
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