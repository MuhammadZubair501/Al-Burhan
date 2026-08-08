// types/dashboard.ts

export interface DashboardFilters {
  date: string;
}

export interface DashboardData {
  studentSummary: {
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  };
  teacherSummary: {
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
  teacherAttendanceTable: Array<{
    department: string;
    teacherCount: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
  }>;
  studentCharts: {
    pie: { labels: string[]; data: number[] };
    bar: { labels: string[]; present: number[]; absent: number[]; leave: number[] };
  };
  teacherCharts: {
    pie: { labels: string[]; data: number[] };
    bar: { labels: string[]; present: number[]; absent: number[]; leave: number[] };
  };
}