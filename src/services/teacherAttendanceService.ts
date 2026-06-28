// services/teacherAttendanceService.ts

import { API_BASE_URL } from "../config/api";

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
    const response = await fetch(`${API_BASE_URL}/teacher-attendance/teachers/campus/${campusId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch teachers for this campus');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch teachers');
  },

  // Get all teachers
  async getTeachers(): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE_URL}/teacher-attendance/teachers`);
    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch teachers');
  },

  // Save attendance
  async saveAttendance(payload: SaveAttendancePayload) {
    console.log('Saving attendance payload:', payload); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/teacher-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('Save attendance response:', result); // Debug log
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to save attendance');
    }
    return result;
  },

  // Update single attendance record (NEW)
  async updateAttendance(attendanceId: number, status: 'present' | 'absent' | 'leave') {
    console.log('Updating attendance:', attendanceId, status); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/teacher-attendance/${attendanceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();
    console.log('Update attendance response:', result); // Debug log
    
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
      `${API_BASE_URL}/teacher-attendance/range?start_date=${startDate}&end_date=${endDate}&campusId=${campusId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch attendance');
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
      `${API_BASE_URL}/teacher-attendance?date=${date}&campusId=${campusId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch attendance');
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
      `${API_BASE_URL}/teacher-attendance/summary?campusId=${campusId}&month=${month}&year=${year}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch attendance summary');
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
      `${API_BASE_URL}/teacher-attendance/teacher/${teacherId}?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch teacher attendance');
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
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete attendance');
    }
    return result;
  }
};