import type { DashboardFilters, DashboardData } from '../types/dashboard';

const mockData: DashboardData = {
  studentSummary: { total: 450, present: 320, absent: 80, leave: 50, percentage: 71.1, newAdmissions: 12 },
  teacherSummary: { total: 35, present: 28, absent: 4, leave: 3, percentage: 80.0, newTeachers: 2 },
  studentAttendanceTable: [
    { className: 'Grade 10', sectionName: 'A', total: 40, present: 30, absent: 6, leave: 4, percentage: 75 },
    // { className: 'Grade 10', sectionName: 'B', total: 38, present: 28, absent: 8, leave: 2, percentage: 73.7 },
    { className: 'Grade 9', sectionName: 'A', total: 45, present: 40, absent: 3, leave: 2, percentage: 88.9 },
  ],
  teacherAttendanceTable: [
    { department: 'Science', teacherCount: 10, present: 8, absent: 1, leave: 1, percentage: 80 },
    { department: 'Arts', teacherCount: 8, present: 7, absent: 0, leave: 1, percentage: 87.5 },
    { department: 'Mathematics', teacherCount: 6, present: 5, absent: 1, leave: 0, percentage: 83.3 },
  ],
  studentCharts: {
    pie: { labels: ['Present', 'Absent', 'Leave'], data: [320, 80, 50] },
    bar: { labels: ['Grade 10A', 'Grade 10B', 'Grade 9A'], present: [30, 28, 40], absent: [6, 8, 3], leave: [4, 2, 2] },
    stacked: { labels: ['Grade 10A', 'Grade 10B', 'Grade 9A'], present: [30, 28, 40], absent: [6, 8, 3], leave: [4, 2, 2] },
    line: { labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'], data: [70, 75, 68, 72, 71] },
    area: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], data: [65, 70, 68, 72, 71] },
  },
  teacherCharts: {
    pie: { labels: ['Present', 'Absent', 'Leave'], data: [28, 4, 3] },
    bar: { labels: ['Science', 'Arts', 'Mathematics'], data: [80, 87.5, 83.3] },
    line: { labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'], data: [80, 82, 79, 85, 80] },
    area: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], data: [78, 80, 79, 82, 80] },
  },
  comparison: {
    today: 71.1,
    yesterday: 70.5,
    last7Days: 69.8,
    last30Days: 72.3,
    monthly: 71.0,
    yearly: 68.5,
    changes: { today: 0.6, yesterday: 0.3, last7Days: -0.5, last30Days: 1.2, monthly: 0.1, yearly: 2.6 },
  },
  topClasses: [
    { rank: 1, className: 'Grade 9', section: 'A', percentage: 88.9 },
    { rank: 2, className: 'Grade 10', section: 'B', percentage: 73.7 },
    { rank: 3, className: 'Grade 10', section: 'A', percentage: 75 },
  ],
  topDepartments: [
    { department: 'Arts', percentage: 87.5 },
    { department: 'Mathematics', percentage: 83.3 },
    { department: 'Science', percentage: 80 },
  ],
  lowClasses: [
    { className: 'Grade 10', section: 'B', percentage: 73.7 },
    { className: 'Grade 10', section: 'A', percentage: 75 },
  ],
  lowDepartments: [
    { department: 'Science', percentage: 80 },
    { department: 'Mathematics', percentage: 83.3 },
  ],
  recentActivities: [
    { id: 1, action: 'Student attendance marked for Grade 10A', timestamp: '2025-03-15 09:30', user: 'John Doe' },
    { id: 2, action: 'Teacher attendance updated for Mr. Smith', timestamp: '2025-03-15 10:15', user: 'Admin' },
    { id: 3, action: 'Leave approved for student Jane', timestamp: '2025-03-15 11:00', user: 'Principal' },
  ],
  absentStudents: [
    { name: 'Alice', class: 'Grade 10', section: 'A', reason: 'Sick' },
    { name: 'Bob', class: 'Grade 9', section: 'A', reason: 'Family event' },
  ],
  absentTeachers: [
    { name: 'Mr. Johnson', department: 'Science', reason: 'Personal' },
    { name: 'Ms. Davis', department: 'Arts', reason: 'Training' },
  ],
  lateStudents: [
    { name: 'Charlie', class: 'Grade 10', section: 'B' },
    { name: 'Diana', class: 'Grade 9', section: 'A' },
  ],
  lateTeachers: [
    { name: 'Mr. Williams', department: 'Mathematics' },
  ],
  insights: [
    'Highest attendance: Grade 9A – 88.9%',
    'Lowest attendance: Grade 10B – 73.7%',
    'Overall attendance: 71.1%',
    'Monthly improvement: +1.2%',
    'Best performing department: Arts – 87.5%',
  ],
};

export const dashboardService = {
  async fetchAll(_filters: DashboardFilters): Promise<DashboardData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData;
  }
};