// services/teacherAttendanceService.ts

import { API_BASE_URL, getAuthHeaders, getFormDataHeaders } from "../config/api";

export interface Teacher {
  teacher_id: number;
  name: string;
  campus_id?: number;
  campus_name?: string;
}

export interface AttendanceRecord {
  attendance_id: number;
  teacher_id: number;
  teacher_name: string;
  attendance_status: 'present' | 'absent' | 'leave';
  date: string;
  campus_id?: number;
}

export interface SaveAttendancePayload {
  attendance_date: string;
  attendance: Array<{
    teacher_id: number;
    status: 'present' | 'absent' | 'leave';
  }>;
  campus_id?: number;
}

export const teacherAttendanceService = {
  // Get teachers by campus
  async getTeachersByCampus(campusId: number): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE_URL}/teacher-attendance/teachers/campus/${campusId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch teachers for this campus');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch teachers');
  },

  // Get all teachers
  async getTeachers(): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE_URL}/teacher-attendance/teachers`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch teachers');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch teachers');
  },

  // Save attendance
  async saveAttendance(payload: SaveAttendancePayload) {
    console.log('Saving attendance payload:', payload);
    
    const response = await fetch(`${API_BASE_URL}/teacher-attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('Save attendance response:', result);
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to save attendance');
    }
    return result;
  },

  // Update single attendance record
  async updateAttendance(attendanceId: number, status: 'present' | 'absent' | 'leave') {
    console.log('Updating attendance:', attendanceId, status);
    
    const response = await fetch(`${API_BASE_URL}/teacher-attendance/${attendanceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const result = await response.json();
    console.log('Update attendance response:', result);
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update attendance');
    }
    return result;
  },

  // Get attendance by date range and campus
  async getAttendanceByDateRangeAndCampus(
    startDate: string, 
    endDate: string, 
    campusId: number
  ): Promise<AttendanceRecord[]> {
    const response = await fetch(
      `${API_BASE_URL}/teacher-attendance/range?start_date=${startDate}&end_date=${endDate}&campusId=${campusId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch attendance');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch attendance');
  },

  // Get attendance by specific date and campus
  async getAttendanceByDateAndCampus(date: string, campusId: number): Promise<AttendanceRecord[]> {
    const response = await fetch(
      `${API_BASE_URL}/teacher-attendance?date=${date}&campusId=${campusId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch attendance');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch attendance');
  },

  // Get attendance summary by month and campus
  async getAttendanceSummaryByCampus(
    campusId: number, 
    month: number, 
    year: number
  ): Promise<{ total_teachers: number; teachers: any[] }> {
    const response = await fetch(
      `${API_BASE_URL}/teacher-attendance/summary?campusId=${campusId}&month=${month}&year=${year}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch attendance summary');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch attendance summary');
  },

  // Get attendance for a specific teacher
  async getTeacherAttendance(teacherId: number, limit: number = 30, offset: number = 0) {
    const response = await fetch(
      `${API_BASE_URL}/teacher-attendance/teacher/${teacherId}?limit=${limit}&offset=${offset}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch teacher attendance');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch teacher attendance');
  },

  // Delete attendance record
  async deleteAttendance(attendanceId: number) {
    const response = await fetch(`${API_BASE_URL}/teacher-attendance/${attendanceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete attendance');
    }
    return result;
  }
};