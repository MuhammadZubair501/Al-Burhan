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
  teacherCharts?: { // Made optional
    pie: { labels: string[]; data: number[] };
    bar: { labels: string[]; present: number[]; absent: number[]; leave: number[] };
  };
  availableClasses: Array<{ id: number; name: string }>;
}