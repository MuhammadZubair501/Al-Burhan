// types/dashboard.ts

export interface DashboardFilters {
  date: string;
  fromDate: string;
  toDate: string;
  classId: number | null;
}

export interface DashboardData {
  studentSummary: {
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  };
  teacherSummary?: {  // Add this as optional
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  };
  teacherAttendanceTable?: Array<{  // Add this as optional
    department: string;
    teacherCount: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  }>;
  studentAttendanceTable: Array<{
    className: string;
    sectionName: string;
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  }>;
  dateRangeAttendance: {
    dates: string[];
    dateHeaders: string[];
    data: Array<{
      className: string;
      sectionName: string;
      total: number;
      [key: string]: string | number;
    }>;
  };
  studentCharts: {
    pie: { labels: string[]; data: number[] };
    bar: { labels: string[]; present: number[]; absent: number[]; leave: number[] };
  };
  teacherCharts?: {
    pie: { labels: string[]; data: number[] };
    bar: { labels: string[]; present: number[]; absent: number[]; leave: number[] };
  };
  availableClasses: Array<{ id: number; name: string }>;
}