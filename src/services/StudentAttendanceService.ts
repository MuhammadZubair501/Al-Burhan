// services/StudentAttendanceService.ts

import { API_BASE_URL } from "../config/api";

export interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  roll_number?: string;
  section_id?: number;
  section_name?: string;
  class_name?: string;
  is_active?: boolean;
}

export interface AttendanceRecord {
  attendance_id: number;
  student_id: number;
  student_name: string;
  attendance_status: 'present' | 'absent' | 'leave';
  date: string;
  section_id?: number;
  campus_id?: number;
  comments?: string;
}

export interface SaveAttendancePayload {
  attendance_date: string;
  attendance: Array<{
    student_id: number;
    status: 'present' | 'absent' | 'leave';
    comments?: string;
  }>;
  section_id?: number;
  campus_id?: number;
}

export const studentAttendanceService = {
  // Get sections with class names by campus
  async getSectionsByCampus(campusId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/student-attendance/sections/campus/${campusId}`);
    if (!response.ok) throw new Error('Failed to fetch sections');
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.message || 'Failed to fetch sections');
  },

  // Get students by section (only active)
  async getStudentsBySection(sectionId: number): Promise<Student[]> {
    const response = await fetch(`${API_BASE_URL}/student-attendance/students/section/${sectionId}`);
    if (!response.ok) throw new Error('Failed to fetch students for this section');
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.message || 'Failed to fetch students');
  },

  // Save attendance
  async saveAttendance(payload: SaveAttendancePayload) {
    const response = await fetch(`${API_BASE_URL}/student-attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to save attendance');
    return result;
  },

  // Update single attendance record
  async updateAttendance(attendanceId: number, status: 'present' | 'absent' | 'leave', comments?: string) {
    const response = await fetch(`${API_BASE_URL}/student-attendance/${attendanceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, comments }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update attendance');
    return result;
  },

  // Get attendance by date range and campus (optional section)
  async getAttendanceByDateRangeAndCampus(
    startDate: string,
    endDate: string,
    campusId: number,
    sectionId?: number
  ): Promise<AttendanceRecord[]> {
    let url = `${API_BASE_URL}/student-attendance/range?start_date=${startDate}&end_date=${endDate}&campusId=${campusId}`;
    if (sectionId) url += `&sectionId=${sectionId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch attendance');
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.message || 'Failed to fetch attendance');
  },

  // Get attendance by specific date and campus (optional section)
  async getAttendanceByDateAndCampus(date: string, campusId: number, sectionId?: number) {
    let url = `${API_BASE_URL}/student-attendance?date=${date}&campusId=${campusId}`;
    if (sectionId) url += `&sectionId=${sectionId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch attendance');
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.message || 'Failed to fetch attendance');
  },

  // Get attendance summary by month and campus (optional section)
  async getAttendanceSummaryByCampus(
    campusId: number,
    month: number,
    year: number,
    sectionId?: number
  ): Promise<{ total_students: number; students: any[] }> {
    let url = `${API_BASE_URL}/student-attendance/summary?campusId=${campusId}&month=${month}&year=${year}`;
    if (sectionId) url += `&sectionId=${sectionId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch attendance summary');
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.message || 'Failed to fetch attendance summary');
  },

  // Get attendance for a specific student
  async getStudentAttendance(studentId: number, limit: number = 30, offset: number = 0) {
    const response = await fetch(
      `${API_BASE_URL}/student-attendance/student/${studentId}?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) throw new Error('Failed to fetch student attendance');
    const result = await response.json();
    if (result.success) return result.data;
    throw new Error(result.message || 'Failed to fetch student attendance');
  },

  // Delete attendance record
  async deleteAttendance(attendanceId: number) {
    const response = await fetch(`${API_BASE_URL}/student-attendance/${attendanceId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete attendance');
    return result;
  },

  // IMPORT ATTENDANCE
  async importAttendance(formData: FormData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/student-attendance/import`, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Import failed');
    return result;
  }
};