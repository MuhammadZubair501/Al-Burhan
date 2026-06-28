export interface DashboardFilters {
  academicYear: number;
  campusId: number | null;
  departmentId: number | null;
  classId: number | null;
  sectionId: number | null;
  date: string;
}

export interface DashboardData {
  studentSummary: {
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
    newAdmissions?: number;
  };
  teacherSummary: {
    total: number;
    present: number;
    absent: number;
    leave: number;
    percentage: number;
    newTeachers?: number;
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
    stacked: { labels: string[]; present: number[]; absent: number[]; leave: number[] };
    line: { labels: string[]; data: number[] };
    area: { labels: string[]; data: number[] };
  };
  teacherCharts: {
    pie: { labels: string[]; data: number[] };
    bar: { labels: string[]; data: number[] };
    line: { labels: string[]; data: number[] };
    area: { labels: string[]; data: number[] };
  };
  comparison: {
    today: number;
    yesterday: number;
    last7Days: number;
    last30Days: number;
    monthly: number;
    yearly: number;
    changes: { today: number; yesterday: number; last7Days: number; last30Days: number; monthly: number; yearly: number };
  };
  topClasses: Array<{ rank: number; className: string; section: string; percentage: number }>;
  topDepartments: Array<{ department: string; percentage: number }>;
  lowClasses: Array<{ className: string; section: string; percentage: number }>;
  lowDepartments: Array<{ department: string; percentage: number }>;
  recentActivities: Array<{ id: number; action: string; timestamp: string; user?: string }>;
  absentStudents: Array<{ name: string; class: string; section: string; reason: string }>;
  absentTeachers: Array<{ name: string; department: string; reason: string }>;
  lateStudents: Array<{ name: string; class: string; section: string }>;
  lateTeachers: Array<{ name: string; department: string }>;
  insights: string[];
}