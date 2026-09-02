// services/teacherDashboardService.ts

import { getAuthHeaders } from '../config/api';
import { API_BASE_URL } from '../config/api';

export interface TeacherInfo {
  teacher_id: number;
  first_name: string;
  last_name: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  campusName: string;
  shift: string;
  joiningDate: string;
}

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'leave';
  comments?: string;
}

export interface TeacherDashboardData {
  teacher: TeacherInfo;
  attendance: AttendanceRecord[];
}

export const teacherDashboardService = {
  // Get teacher dashboard data
  async getDashboardData(): Promise<{ success: boolean; data: TeacherDashboardData }> {
    try {
      const url = `${API_BASE_URL}/teacher-attendance/dashboard`;
      console.log('📊 Fetching teacher dashboard data from:', url);

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      throw error;
    }
  },

  // Get teacher dashboard stats
  async getDashboardStats(): Promise<{ success: boolean; data: any }> {
    try {
      const url = `${API_BASE_URL}/teacher-attendance/dashboard/stats`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard stats');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching teacher dashboard stats:', error);
      throw error;
    }
  },

  // Get teacher attendance by date range
  async getAttendanceByDateRange(
    startDate: string,
    endDate: string
  ): Promise<{ success: boolean; data: any }> {
    try {
      const url = `${API_BASE_URL}/teacher-attendance/dashboard/range?startDate=${startDate}&endDate=${endDate}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch attendance data');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching teacher attendance by date range:', error);
      throw error;
    }
  }
};