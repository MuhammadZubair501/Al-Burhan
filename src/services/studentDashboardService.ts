// services/studentDashboardService.ts

import { getAuthHeaders } from '../config/api';
import ApiRoutes from './ApiRoutes';

export interface StudentInfo {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  rollNumber: string;
  email: string;
  phone: string;
  className: string;
  campusName: string;
  sectionName: string;
  sectionTeacher: string;
  shift: string;
  classId: number;
  sectionId: number;
  campusId: number;
  isActive: boolean;
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

export interface MonthlyAttendanceData {
  date: string;
  day: string;
  dayName: string;
  Present: number;
  Absent: number;
  Leave: number;
}

export interface StudentDashboardData {
  student: StudentInfo;
  attendance: {
    dateRange: {
      fromDate: string;
      toDate: string;
    };
    summary: AttendanceSummary;
    records: AttendanceRecord[];
    monthlyData: MonthlyAttendanceData[];
    monthlySummary: any[];
    recentAttendance: AttendanceRecord[];
  };
}

export const studentDashboardService = {
  // Get student dashboard data
  async getDashboardData(
    studentId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{ success: boolean; data: StudentDashboardData }> {
    try {
      let url = ApiRoutes.studentDashboardData(studentId);
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      console.log('📊 Fetching dashboard data from:', url);

      const response = await fetch(url, {
        headers: getAuthHeaders(), // This adds the Authorization header
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      console.error('Error fetching student dashboard data:', error);
      throw error;
    }
  },

  // Get student by user ID
  async getStudentByUserId(userId: number): Promise<{ success: boolean; data: { student: any } }> {
    try {
      const url = ApiRoutes.studentByUserId(userId);
      console.log('🔍 Fetching student by userId from:', url);

      const response = await fetch(url, {
        headers: getAuthHeaders(), // This adds the Authorization header
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch student data');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching student by user ID:', error);
      throw error;
    }
  },

  // Get attendance by date range
  async getAttendanceByDateRange(
    studentId: number,
    startDate: string,
    endDate: string
  ): Promise<{ success: boolean; data: any }> {
    try {
      const url = ApiRoutes.studentAttendanceByDateRange(studentId, startDate, endDate);
      
      const response = await fetch(url, {
        headers: getAuthHeaders(), // This adds the Authorization header
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      console.error('Error fetching attendance by date range:', error);
      throw error;
    }
  },

  // Get attendance statistics
  async getAttendanceStats(studentId: number): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(ApiRoutes.studentAttendanceStats(studentId), {
        headers: getAuthHeaders(), // This adds the Authorization header
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch attendance stats');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  },

  // Get attendance summary by month
  async getAttendanceSummary(studentId: number, year?: number): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(ApiRoutes.studentAttendanceSummary(studentId, year), {
        headers: getAuthHeaders(), // This adds the Authorization header
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch attendance summary');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      throw error;
    }
  },

  // Get current month attendance for chart
  async getCurrentMonthAttendance(
    studentId: number,
    month?: number,
    year?: number
  ): Promise<{ success: boolean; data: any }> {
    try {
      const url = ApiRoutes.studentCurrentMonthAttendance(studentId, month, year);
      
      const response = await fetch(url, {
        headers: getAuthHeaders(), // This adds the Authorization header
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch current month attendance');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching current month attendance:', error);
      throw error;
    }
  },

  // Get recent attendance
  async getRecentAttendance(studentId: number, limit: number = 10): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(ApiRoutes.studentRecentAttendance(studentId, limit), {
        headers: getAuthHeaders(), // This adds the Authorization header
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch recent attendance');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error fetching recent attendance:', error);
      throw error;
    }
  }
};