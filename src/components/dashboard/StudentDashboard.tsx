// StudentDashboard.tsx

import { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  GraduationCap,
  Building2,
  Users,
  User,
  TrendingUp,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  List,
  MessageSquareText,
  LayoutDashboard,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { studentDashboardService } from '../../services/studentDashboardService';
import { authService } from '../../services/authService';
import Swal from 'sweetalert2';
import PageHeader from '../PageHeader';

// ============================================
// TYPES
// ============================================
interface StudentInfo {
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

// ============================================
// STATS CARD COMPONENT - RESPONSIVE
// ============================================
interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatsCard({ label, value, icon, color, bgColor }: StatsCardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all hover:border-yellow-400/30 group hover:scale-[1.02] duration-200">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-green-100/60 text-[9px] sm:text-xs md:text-sm font-medium uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-0.5 truncate">
            {value}
          </p>
        </div>
        <div className={`p-1.5 sm:p-2 rounded-xl ${bgColor} transition-all group-hover:scale-110 flex-shrink-0`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STATUS BADGE COMPONENT - RESPONSIVE
// ============================================
const getStatusBadge = (status: string) => {
  const configs = {
    present: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400', label: 'Present' },
    absent: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400', label: 'Absent' },
    leave: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Leave' }
  };
  const cfg = configs[status as keyof typeof configs] || configs.absent;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-medium border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <span>{cfg.label}</span>
    </span>
  );
};

// ============================================
// CUSTOM TOOLTIP FOR CHART - RESPONSIVE
// ============================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);
    return (
      <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-2xl">
        <p className="text-white font-semibold text-xs sm:text-sm">{label}</p>
        <div className="mt-1 space-y-0.5 text-[9px] sm:text-xs">
          <p className="text-green-400">Present: {payload[0].value}</p>
          <p className="text-red-400">Absent: {payload[1].value}</p>
          <p className="text-yellow-400">Leave: {payload[2].value}</p>
          <p className="text-green-100/60 border-t border-white/10 pt-0.5 mt-0.5">
            Total: {total}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// ============================================
// MAIN STUDENT DASHBOARD
// ============================================
export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [allAttendanceRecords, setAllAttendanceRecords] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [refreshing, setRefreshing] = useState(false);

  // ============================================
  // LOAD STUDENT DATA
  // ============================================
  const loadStudentDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = authService.getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const studentResponse = await studentDashboardService.getStudentByUserId(userId);
      if (!studentResponse.success || !studentResponse.data.student) {
        throw new Error('Student not found');
      }

      const student = studentResponse.data.student;

      const fromDate = new Date(2024, 0, 1).toISOString().split('T')[0];
      const toDate = new Date().toISOString().split('T')[0];

      const dashboardResponse = await studentDashboardService.getDashboardData(
        student.student_id,
        fromDate,
        toDate
      );

      if (dashboardResponse.success) {
        setStudentInfo(dashboardResponse.data.student);
        setAllAttendanceRecords(dashboardResponse.data.attendance.records || []);
      }
    } catch (err: any) {
      console.error('Error loading student dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentDashboard();
  }, []);

  // ============================================
  // REFRESH DATA
  // ============================================
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStudentDashboard();
    setRefreshing(false);
  };

  // ============================================
  // MONTH NAVIGATION
  // ============================================
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const now = new Date();
    if (currentMonth === 11) {
      if (currentYear < now.getFullYear()) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      }
    } else {
      if (currentYear < now.getFullYear() || (currentYear === now.getFullYear() && currentMonth < now.getMonth())) {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthLabel = `${monthNames[currentMonth]} ${currentYear}`;

  // ============================================
  // COMPUTED VALUES
  // ============================================
  const filteredAttendance = useMemo(() => {
    if (!allAttendanceRecords || allAttendanceRecords.length === 0) return [];
    return allAttendanceRecords.filter((record: any) => {
      return record.date >= startDate && record.date <= endDate;
    });
  }, [allAttendanceRecords, startDate, endDate]);

  const attendanceSummary = useMemo(() => {
    const total = filteredAttendance.length;
    if (total === 0) {
      return { totalDays: 0, present: 0, absent: 0, leave: 0, percentage: 0 };
    }
    const present = filteredAttendance.filter((r: any) => r.status === 'present').length;
    const absent = filteredAttendance.filter((r: any) => r.status === 'absent').length;
    const leave = filteredAttendance.filter((r: any) => r.status === 'leave').length;
    const percentage = Math.round((present / total) * 100);
    return { totalDays: total, present, absent, leave, percentage };
  }, [filteredAttendance]);

  const monthlyData = useMemo(() => {
    if (!allAttendanceRecords || allAttendanceRecords.length === 0) return [];
    
    const filtered = allAttendanceRecords.filter((record: any) => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    const chartData = filtered.map((record: any) => {
      const dateObj = new Date(record.date);
      return {
        date: record.date,
        day: `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`,
        dayName: dateObj.toLocaleString('default', { weekday: 'short' }),
        Present: record.status === 'present' ? 1 : 0,
        Absent: record.status === 'absent' ? 1 : 0,
        Leave: record.status === 'leave' ? 1 : 0,
      };
    });

    return chartData.sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [allAttendanceRecords, currentMonth, currentYear]);

  const tableRecords = useMemo(() => {
    if (!allAttendanceRecords || allAttendanceRecords.length === 0) return [];
    return allAttendanceRecords.filter((record: any) => {
      return record.date >= startDate && record.date <= endDate;
    });
  }, [allAttendanceRecords, startDate, endDate]);

  // ============================================
  // VIEW COMMENT MODAL
  // ============================================
  const viewComment = (comment: string) => {
    if (!comment || !comment.trim()) {
      Swal.fire({
        title: "No Comment",
        text: "No comment provided for this record.",
        icon: "info",
        confirmButtonColor: "#fbbf24",
        background: "#1a2e2a",
        color: "#ffffff",
      });
      return;
    }
    Swal.fire({
      title: "Comment",
      text: comment,
      icon: "info",
      confirmButtonColor: "#fbbf24",
      background: "#1a2e2a",
      color: "#ffffff",
      width: 400,
    });
  };

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 animate-spin" />
          <p className="text-white text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center max-w-md mx-auto">
          <p className="text-red-200 font-semibold">Error</p>
          <p className="text-red-300 text-sm mt-2">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-yellow-400 text-green-950 rounded-xl font-semibold hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-3 md:p-4 lg:p-6">
      <PageHeader
        title="Dashboard"
        description="Student Attendance Overview"
        Icon={LayoutDashboard}
      />
      
      {/* ========================================== */}
      {/* 1. HEADER / STUDENT PROFILE SUMMARY - RESPONSIVE */}
      {/* ========================================== */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 mb-3 sm:mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 truncate">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 w-1.5 h-6 sm:h-8 md:h-10 rounded-full flex-shrink-0"></span>
              {studentInfo?.fullName || 'Student'}
            </h1>
            <p className="text-green-100/60 text-xs sm:text-sm mt-0.5 truncate">
              Roll #{studentInfo?.rollNumber || 'N/A'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 sm:p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all border border-white/10 cursor-pointer disabled:opacity-50 flex-shrink-0 self-start"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Student Info Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
          {[
            { icon: GraduationCap, label: 'Class', value: studentInfo?.className || 'N/A', color: 'text-blue-400', bg: 'bg-blue-500/20' },
            { icon: Building2, label: 'Campus', value: studentInfo?.campusName || 'N/A', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
            { icon: Users, label: 'Section', value: studentInfo?.sectionName || 'N/A', color: 'text-purple-400', bg: 'bg-purple-500/20' },
            { icon: User, label: 'Section Teacher', value: studentInfo?.sectionTeacher || 'N/A', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3 bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/5">
              <div className={`p-1.5 sm:p-2 rounded-lg ${item.bg}`}>
                <item.icon size={14} className={`sm:w-4 sm:h-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-green-100/40 text-[8px] sm:text-[10px] uppercase tracking-wider truncate">{item.label}</p>
                <p className="text-white text-xs sm:text-sm font-medium truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. MONTHLY ATTENDANCE GRAPH - RESPONSIVE */}
      {/* ========================================== */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 mb-3 sm:mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
              Monthly Attendance - {monthLabel}
            </h3>
            <span className="text-green-100/40 text-xs whitespace-nowrap">
              ({monthlyData.length} days)
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all border border-white/10 cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <span className="text-green-100 text-xs sm:text-sm font-medium px-1.5 sm:px-2 min-w-[70px] sm:min-w-[100px] text-center truncate">
              {monthLabel}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 sm:p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all border border-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
              aria-label="Next month"
            >
              <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-green-100/30">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mb-2 sm:mb-3 opacity-30" />
            <p className="text-sm sm:text-base">No attendance data available</p>
            <p className="text-xs sm:text-sm mt-1">Only dates with data are shown</p>
          </div>
        ) : (
          <>
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 5, left: -5, bottom: 10 }}
                  barGap={0}
                  barCategoryGap={monthlyData.length > 15 ? 2 : 6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#9ca3af', fontSize: 8, fontWeight: 500 }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    interval={0}
                    minTickGap={4}
                    angle={monthlyData.length > 15 ? -45 : 0}
                    textAnchor={monthlyData.length > 15 ? 'end' : 'middle'}
                    height={monthlyData.length > 15 ? 40 : 25}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 8 }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    allowDecimals={false}
                    domain={[0, 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={24}
                    iconType="circle"
                    iconSize={6}
                    wrapperStyle={{ fontSize: '8px' }}
                    formatter={(value) => (
                      <span className="text-green-100/80 text-[8px] sm:text-[10px] font-medium">
                        {value}
                      </span>
                    )}
                  />
                  <Bar dataKey="Present" stackId="a" fill="#4ade80" radius={[0, 0, 0, 0]} maxBarSize={monthlyData.length > 15 ? 16 : 24} />
                  <Bar dataKey="Absent" stackId="a" fill="#f87171" radius={[0, 0, 0, 0]} maxBarSize={monthlyData.length > 15 ? 16 : 24} />
                  <Bar dataKey="Leave" stackId="a" fill="#facc15" radius={[0, 0, 0, 0]} maxBarSize={monthlyData.length > 15 ? 16 : 24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center text-green-100/30 text-[8px] sm:text-[10px] mt-1 sm:mt-2">
              * Only dates with attendance data are shown
            </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* 3. DATE RANGE PICKER + ATTENDANCE SUMMARY - RESPONSIVE */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
        {/* Date Range Picker */}
        <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <CalendarIcon size={16} className="sm:w-[18px] sm:h-[18px] text-yellow-400" />
            <h3 className="text-white font-semibold text-sm sm:text-base">Filter by Date</h3>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div>
              <label className="text-green-100/60 text-[10px] sm:text-xs font-medium block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/10 text-white rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xs sm:text-sm"
                max={endDate}
              />
            </div>

            <div>
              <label className="text-green-100/60 text-[10px] sm:text-xs font-medium block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white/10 text-white rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xs sm:text-sm"
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="pt-1 sm:pt-2 text-center text-green-100/40 text-[10px] sm:text-xs">
              {filteredAttendance.length} days in range
            </div>
          </div>
        </div>

        {/* Summary Stats - 6 cards responsive */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <StatsCard
            label="Total Days"
            value={attendanceSummary.totalDays}
            icon={<Calendar size={14} className="sm:w-4 sm:h-4" />}
            color="text-blue-400"
            bgColor="bg-blue-500/20"
          />
          <StatsCard
            label="Present"
            value={attendanceSummary.present}
            icon={<TrendingUp size={14} className="sm:w-4 sm:h-4" />}
            color="text-green-400"
            bgColor="bg-green-500/20"
          />
          <StatsCard
            label="Attendance %"
            value={`${attendanceSummary.percentage}%`}
            icon={<TrendingUp size={14} className="sm:w-4 sm:h-4" />}
            color="text-purple-400"
            bgColor="bg-purple-500/20"
          />
          <StatsCard
            label="Absent"
            value={attendanceSummary.absent}
            icon={<TrendingUp size={14} className="sm:w-4 sm:h-4" />}
            color="text-red-400"
            bgColor="bg-red-500/20"
          />
          <StatsCard
            label="Leave"
            value={attendanceSummary.leave}
            icon={<TrendingUp size={14} className="sm:w-4 sm:h-4" />}
            color="text-yellow-400"
            bgColor="bg-yellow-500/20"
          />
          <StatsCard
            label="Present Rate"
            value={attendanceSummary.percentage >= 80 ? '✅ Good' : '⚠️ Needs Improvement'}
            icon={<TrendingUp size={14} className="sm:w-4 sm:h-4" />}
            color={attendanceSummary.percentage >= 80 ? 'text-green-400' : 'text-orange-400'}
            bgColor={attendanceSummary.percentage >= 80 ? 'bg-green-500/20' : 'bg-orange-500/20'}
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* 4. ATTENDANCE TABLE - RESPONSIVE */}
      {/* ========================================== */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <List size={16} className="sm:w-[18px] sm:h-[18px] text-yellow-400 flex-shrink-0" />
            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
              My Attendance Records
            </h3>
            <span className="text-green-100/40 text-xs whitespace-nowrap">
              ({tableRecords.length} records)
            </span>
          </div>
        </div>

        {tableRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 text-green-100/30">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 opacity-30" />
            <p className="text-sm sm:text-base">No attendance records found</p>
            <p className="text-xs sm:text-sm mt-1">Adjust the date filter above to see records</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="max-h-[200px] sm:max-h-[250px] md:max-h-[300px] overflow-y-auto px-2 sm:px-0">
              <table className="w-full min-w-[400px] sm:min-w-[500px]">
                <thead className="sticky top-0 z-10 bg-emerald-900/80 backdrop-blur">
                  <tr>
                    <th className="p-1.5 sm:p-2 text-left text-yellow-300 font-semibold text-[8px] sm:text-[10px] uppercase tracking-wider w-8 sm:w-12">#</th>
                    <th className="p-1.5 sm:p-2 text-left text-yellow-300 font-semibold text-[8px] sm:text-[10px] uppercase tracking-wider">Date</th>
                    <th className="p-1.5 sm:p-2 text-center text-yellow-300 font-semibold text-[8px] sm:text-[10px] uppercase tracking-wider">Status</th>
                    <th className="p-1.5 sm:p-2 text-center text-yellow-300 font-semibold text-[8px] sm:text-[10px] uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRecords.map((record: any, index: number) => {
                    const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    });
                    return (
                      <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition">
                        <td className="p-1.5 sm:p-2 text-green-100/60 font-mono text-[8px] sm:text-[10px] text-center">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="p-1.5 sm:p-2 text-white font-medium text-[8px] sm:text-[10px] truncate max-w-[70px] sm:max-w-none">
                          {formattedDate}
                        </td>
                        <td className="p-1.5 sm:p-2 text-center">
                          {getStatusBadge(record.status)}
                        </td>
                        <td className="p-1.5 sm:p-2 text-center">
                          {record.status === "leave" ? (
                            <button
                              onClick={() => viewComment(record.comments || "No comment provided.")}
                              className="cursor-pointer inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all text-[8px] sm:text-[10px]"
                            >
                              <MessageSquareText size={10} className="sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">View</span>
                            </button>
                          ) : (
                            <span className="text-green-100/60 text-[8px] sm:text-[10px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}