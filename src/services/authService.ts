import ApiRoutes from './ApiRoutes';
import { getAuthHeaders, setAuthToken, removeAuthToken, getAuthToken } from '../config/api';

// ============================================
// GENERIC TIME CONFIGURATION
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

const SESSION = parseTimeConfig(
  parseInt(import.meta.env.VITE_SESSION_DAYS || '0'),
  parseInt(import.meta.env.VITE_SESSION_HOURS || '0'),
  parseInt(import.meta.env.VITE_SESSION_MINUTES || '0'),
  20
);

const WARNING = parseTimeConfig(
  parseInt(import.meta.env.VITE_SESSION_WARNING_DAYS || '0'),
  parseInt(import.meta.env.VITE_SESSION_WARNING_HOURS || '0'),
  parseInt(import.meta.env.VITE_SESSION_WARNING_MINUTES || '0'),
  3
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
      campusId?: number | null;
      campus_name?: string | null;
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
  // ============================================
  // LOGIN
  // ============================================
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
      
      console.log('🔐 Login response:', data);
      
      if (data.success && data.data?.token) {
        setAuthToken(data.data.token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        localStorage.setItem('loginTime', Date.now().toString());
        
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          
          // Store campus ID from response
          if (data.data.user.campusId !== null && data.data.user.campusId !== undefined) {
            console.log('📚 Storing campus ID from response:', data.data.user.campusId);
            localStorage.setItem('userCampusId', String(data.data.user.campusId));
            localStorage.setItem('CampusID', String(data.data.user.campusId));
            (window as any).CampusID = data.data.user.campusId;
          } else {
            console.log('📚 No campus ID in response (admin)');
          }
          
          if (data.data.user.campus_name) {
            localStorage.setItem('userCampusName', data.data.user.campus_name);
          }
        }
        
        // Store session label
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
        
        // Debug after login
        authService.debugAuthState();
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

  // ============================================
  // DEBUG AUTH STATE
  // ============================================
  debugAuthState: (): void => {
    console.log('🔍 === AUTH DEBUG ===');
    console.log('🔍 Token:', localStorage.getItem('authToken') ? 'Present' : 'Missing');
    console.log('🔍 User:', localStorage.getItem('user'));
    console.log('🔍 userCampusId:', localStorage.getItem('userCampusId'));
    console.log('🔍 CampusID:', localStorage.getItem('CampusID'));
    console.log('🔍 selectedCampusId:', localStorage.getItem('selectedCampusId'));
    console.log('🔍 window.CampusID:', (window as any).CampusID);
    console.log('🔍 getUserCampusId():', authService.getUserCampusId());
    console.log('🔍 getUserRole():', authService.getUserRole());
    console.log('🔍 ====================');
  },

  // ============================================
  // LOGOUT
  // ============================================
  logout: (): void => {
    removeAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('sessionLabel');
    localStorage.removeItem('sessionDetails');
    localStorage.removeItem('userCampusId');
    localStorage.removeItem('userCampusName');
  },

  // ============================================
  // CLEAR ALL STORED DATA
  // ============================================
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
    localStorage.removeItem('userCampusId');
    localStorage.removeItem('userCampusName');
    localStorage.removeItem('selectedCampusId');
    localStorage.removeItem('selectedCampusName');
    localStorage.removeItem('CampusID');
  },

  // ============================================
  // EXTEND SESSION
  // ============================================
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

  // ============================================
  // CHECK SESSION STATUS
  // ============================================
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
  // SESSION HELPER METHODS
  // ============================================
  getSessionLabel: (): string => {
    const label = localStorage.getItem('sessionLabel');
    return label || SESSION.label;
  },

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

  getSessionDurationMs: (): number => {
    return SESSION.ms;
  },

  getWarningDurationMs: (): number => {
    return WARNING.ms;
  },

  getSessionDurationLabel: (): string => {
    return SESSION.label;
  },

  getWarningDurationLabel: (): string => {
    return WARNING.label;
  },

  // ============================================
  // CAMPUS HELPER METHODS
  // ============================================
  getUserCampusId: (): number | null => {
    console.log('🔍 getUserCampusId called');
    
    // First try to get from localStorage (set during login)
    const campusId = localStorage.getItem('userCampusId');
    if (campusId) {
      console.log('📚 getUserCampusId from localStorage:', campusId);
      return parseInt(campusId);
    }
    
    // Then try to get from user object
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('📚 user object:', user);
        if (user.campusId) {
          console.log('📚 getUserCampusId from user object:', user.campusId);
          return user.campusId;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Then try to get from token
    const token = getAuthToken();
    if (!token) {
      console.log('📚 No token found');
      return null;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('📚 Token payload:', payload);
      console.log('📚 getUserCampusId from token:', payload.campusId);
      return payload.campusId || null;
    } catch (error) {
      console.error('Error decoding token for campus ID:', error);
      return null;
    }
  },

  getUserCampusName: (): string | null => {
    const campusName = localStorage.getItem('userCampusName');
    if (campusName) {
      return campusName;
    }
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.campus_name || null;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return null;
  },

  // ============================================
  // ROLE HELPER METHODS
  // ============================================
  hasAnyRole: (allowedRoles: string[]): boolean => {
    const role = authService.getUserRole();
    if (!role) return false;
    return allowedRoles.includes(role);
  },

  hasAllRoles: (requiredRoles: string[]): boolean => {
    const role = authService.getUserRole();
    if (!role) return false;
    return requiredRoles.every(r => r === role);
  },

  isAdmin: (): boolean => {
    const role = authService.getUserRole();
    return role === 'admin' || role === 'super_admin';
  },

  isSuperAdmin: (): boolean => {
    const role = authService.getUserRole();
    return role === 'super_admin';
  },

  isTeacherOrNaqeeb: (): boolean => {
    const role = authService.getUserRole();
    return role === 'teacher' || role === 'naqeeb';
  },

  isTeacher: (): boolean => {
    const role = authService.getUserRole();
    return role === 'teacher';
  },

  isNaqeeb: (): boolean => {
    const role = authService.getUserRole();
    return role === 'naqeeb';
  },

  isStudent: (): boolean => {
    const role = authService.getUserRole();
    return role === 'student';
  },

  getUserRoleSafe: (): string => {
    const role = authService.getUserRole();
    return role || 'unknown';
  },

  hasCampusAccess: (): boolean => {
    return authService.isAdmin();
  },

  getLandingPage: (): string => {
    const role = authService.getUserRole();
    if (role === 'admin' || role === 'super_admin') {
      return '/Campus';
    }
    return '/MainDeshboard';
  },

  getMenuItemsByRole: (): string[] => {
    const role = authService.getUserRole();
    const baseMenus = ['dashboard', 'library'];
    
    if (role === 'admin' || role === 'super_admin') {
      return [...baseMenus, 'class', 'teacher', 'student', 'configuration'];
    }
    
    if (role === 'teacher' || role === 'naqeeb') {
      return baseMenus;
    }
    
    if (role === 'student') {
      return baseMenus;
    }
    
    return baseMenus;
  },

  canAccessAttendance: (): boolean => {
    const role = authService.getUserRole();
    return role === 'teacher' || role === 'naqeeb' || role === 'admin' || role === 'super_admin';
  },

  canAccessTeacherAttendance: (): boolean => {
    const role = authService.getUserRole();
    return role === 'admin' || role === 'super_admin';
  },

  canAccessStudentAttendance: (): boolean => {
    const role = authService.getUserRole();
    return role === 'teacher' || role === 'naqeeb' || role === 'admin' || role === 'super_admin';
  },

  canAccessTeacherManagement: (): boolean => {
    const role = authService.getUserRole();
    return role === 'admin' || role === 'super_admin';
  },

  canAccessStudentManagement: (): boolean => {
    const role = authService.getUserRole();
    return role === 'admin' || role === 'super_admin';
  },

  canAccessClassManagement: (): boolean => {
    const role = authService.getUserRole();
    return role === 'admin' || role === 'super_admin';
  },

  canAccessConfiguration: (): boolean => {
    const role = authService.getUserRole();
    return role === 'admin' || role === 'super_admin';
  },

  hasPermission: (permission: string): boolean => {
    const role = authService.getUserRole();
    
    if (role === 'admin' || role === 'super_admin') {
      return true;
    }
    
    const permissions: Record<string, string[]> = {
      'view_dashboard': ['admin', 'super_admin', 'teacher', 'naqeeb', 'student'],
      'view_library': ['admin', 'super_admin', 'teacher', 'naqeeb', 'student'],
      'view_attendance': ['admin', 'super_admin', 'teacher', 'naqeeb'],
      'manage_students': ['admin', 'super_admin'],
      'manage_teachers': ['admin', 'super_admin'],
      'manage_classes': ['admin', 'super_admin'],
      'manage_configuration': ['admin', 'super_admin'],
      'view_campus': ['admin', 'super_admin'],
    };
    
    const allowedRoles = permissions[permission] || [];
    return allowedRoles.includes(role || '');
  },

  // ============================================
  // END ROLE HELPER METHODS
  // ============================================

  // ============================================
  // GET PROFILE
  // ============================================
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

  // ============================================
  // CHANGE PASSWORD
  // ============================================
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

  // ============================================
  // GET USER BY EMAIL
  // ============================================
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

  // ============================================
  // RESET PASSWORD
  // ============================================
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

  // ============================================
  // AUTHENTICATION STATUS
  // ============================================
  isAuthenticated: (): boolean => {
    const token = getAuthToken();
    if (!token) return false;
    
    const sessionStatus = authService.checkSessionStatus();
    return sessionStatus.isValid;
  },

  // ============================================
  // GET USER ROLE
  // ============================================
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

  // ============================================
  // GET USER ID
  // ============================================
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