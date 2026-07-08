import { Plus, Users, Calendar as CalendarIcon, Search, X, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import TeacherAttendanceModal from "./TeacherAttendanceModal";
import { teacherAttendanceService } from "../../services/teacherAttendanceService";
import Swal from "sweetalert2";
import AttendanceStatusModal, { type AttendanceStatus } from "../AttendanceStatusModal";
import SearchDropdown from "../../components/custom/SearchDropdown";

type AttendanceRecord = {
  attendance_id: number;
  teacher_id: number;
  teacher_name: string;
  attendance_status: 'present' | 'absent' | 'leave';
  date: string;
  campus_id?: number;
};

type Teacher = {
  teacher_id: number;
  name: string;
  campus_id?: number;
  campus_name?: string;
};

type FilterState = {
  startDate: string;
  endDate: string;
  teacherId: number | null;
  status: 'present' | 'absent' | 'leave' | 'all';
  searchTerm: string;
};

export default function TeacherAttendancePage() {
  const campusId = (window as any).CampusID || 1;
  
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [campusName, setCampusName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [selectedTeacherName, setSelectedTeacherName] = useState("All Teachers");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    teacherId: null,
    status: 'all',
    searchTerm: ''
  });

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [teacherAttendance, setTeacherAttendance] = useState<
    Record<number, 'present' | 'absent' | 'leave'>
  >({});

  useEffect(() => {
    if (campusId) {
      fetchCampusName();
      fetchTeachers();
      fetchAttendanceRecords();
    }
  }, [campusId]);

  useEffect(() => {
    applyFilters();
  }, [attendanceRecords, filters.teacherId, filters.status, filters.searchTerm]);

  const fetchCampusName = async () => {
    try {
      setCampusName(`Campus ${campusId}`);
    } catch (error) {
      console.error('Error fetching campus name:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await teacherAttendanceService.getTeachersByCampus(campusId);
      setTeachers(data.map((teacher: any) => ({
        teacher_id: teacher.teacher_id,
        name: teacher.name,
        campus_id: teacher.campus_id,
        campus_name: teacher.campus_name
      })));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load teachers",
        icon: "error",
        confirmButtonColor: "#fbbf24",
        background: "#1a2e2a",
        color: "#ffffff",
      });
    }
  };

  const fetchAttendanceRecords = async () => {
    if (!campusId || !filters.startDate || !filters.endDate) return;
    
    setLoading(true);
    try {
      const records = await teacherAttendanceService.getAttendanceByDateRangeAndCampus(
        filters.startDate,
        filters.endDate,
        campusId
      );
      setAttendanceRecords(records);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch attendance records",
        icon: "error",
        confirmButtonColor: "#fbbf24",
        background: "#1a2e2a",
        color: "#ffffff",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendanceRecords];
    if (filters.teacherId) {
      filtered = filtered.filter(record => record.teacher_id === filters.teacherId);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(record => record.attendance_status === filters.status);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.teacher_name.toLowerCase().includes(searchLower)
      );
    }
    setFilteredRecords(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(prev => ({
      ...prev,
      teacherId: null,
      status: 'all',
      searchTerm: ''
    }));
    setSelectedTeacherName("All Teachers");
  };

  const handleAttendanceChange = (teacherId: number, status: 'present' | 'absent' | 'leave') => {
    setTeacherAttendance((prev) => ({
      ...prev,
      [teacherId]: status,
    }));
  };

  const handleSaveAttendance = async (data: {
    attendance_date: string;
    attendance: Array<{ teacher_id: number; status: 'present' | 'absent' | 'leave' }>;
  }) => {
    try {
      const payload = {
        attendance_date: data.attendance_date,
        attendance: data.attendance,
        campus_id: campusId,
      };

      const response = await teacherAttendanceService.saveAttendance(payload);

      await Swal.fire({
        title: "Success!",
        text: response.message || "Attendance submitted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#1a2e2a",
        color: "#ffffff",
      });

      await fetchAttendanceRecords();
      setOpenModal(false);
      
      const initialAttendance: Record<number, 'present' | 'absent' | 'leave'> = {};
      teachers.forEach((teacher) => {
        initialAttendance[teacher.teacher_id] = 'absent';
      });
      setTeacherAttendance(initialAttendance);
      
    } catch (error) {
      console.error('Error saving attendance:', error);
      Swal.fire({
        title: "Error!",
        text: error instanceof Error ? error.message : "Failed to save attendance",
        icon: "error",
        confirmButtonColor: "#fbbf24",
        background: "#1a2e2a",
        color: "#ffffff",
      });
    }
  };

  const handleDelete = async (attendanceId: number, teacherName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete attendance record for "${teacherName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "#1a2e2a",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      await teacherAttendanceService.deleteAttendance(attendanceId);

      await Swal.fire({
        title: "Deleted!",
        text: "Attendance record deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#1a2e2a",
        color: "#ffffff",
      });

      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Error deleting attendance:", error);
      Swal.fire({
        title: "Error!",
        text: error instanceof Error ? error.message : "Failed to delete attendance",
        icon: "error",
        confirmButtonColor: "#fbbf24",
        background: "#1a2e2a",
        color: "#ffffff",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      present: {
        bg: 'bg-green-500/20',
        border: 'border-green-500/30',
        text: 'text-green-400',
        dot: 'bg-green-400',
        label: 'Present'
      },
      absent: {
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
        dot: 'bg-red-400',
        label: 'Absent'
      },
      leave: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        dot: 'bg-yellow-400',
        label: 'Leave'
      }
    };
    return configs[status as keyof typeof configs] || configs.absent;
  };

  const getStatusCount = (status: string) => {
    return filteredRecords.filter(r => r.attendance_status === status).length;
  };

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    { label: 'Total Records', value: filteredRecords.length, color: 'text-white' },
    { label: 'Present', value: getStatusCount('present'), color: 'text-green-400' },
    { label: 'Absent', value: getStatusCount('absent'), color: 'text-red-400' },
    { label: 'On Leave', value: getStatusCount('leave'), color: 'text-yellow-400' },
    { label: 'Teachers', value: teachers.length, color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-40 sm:w-56 h-40 sm:h-56 border-2 border-white rounded-full"></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Teacher Attendance"
          description={`Manage attendance records for ${campusName}`}
          Icon={Users}
        />

        {/* Filter Section - Responsive */}
        <div className="mb-4 sm:mb-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Date Range */}
            <div className="flex flex-wrap items-center gap-2">
              <CalendarIcon size={16} className="text-yellow-400 hidden sm:block" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="bg-white/10 text-white rounded-xl px-3 sm:px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-[130px] sm:w-36 text-sm"
              />
              <span className="text-green-100 text-sm">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="bg-white/10 text-white rounded-xl px-3 sm:px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-[130px] sm:w-36 text-sm"
              />
            </div>

            {/* Teacher Filter - Mobile Friendly */}
            <div className="flex-1 min-w-[180px]">
              <SearchDropdown
                label=""
                placeholder="Select Teacher"
                icon={<Users size={16} className="text-yellow-300" />}
                options={[
                  { id: 0, name: "All Teachers" },
                  ...teachers.map(t => ({ id: t.teacher_id, name: t.name }))
                ]}
                value={selectedTeacherName}
                onChange={(selectedName) => {
                  if (selectedName === "All Teachers") {
                    setFilters(prev => ({ ...prev, teacherId: null }));
                    setSelectedTeacherName("All Teachers");
                  } else {
                    const teacher = teachers.find(t => t.name === selectedName);
                    if (teacher) {
                      setFilters(prev => ({ ...prev, teacherId: teacher.teacher_id }));
                      setSelectedTeacherName(teacher.name);
                    }
                  }
                }}
                isOpen={isTeacherDropdownOpen}
                onToggle={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
                onClose={() => setIsTeacherDropdownOpen(false)}
                className="w-full"
                dropdownClassName="bg-emerald-950/95"
                triggerClassName="w-full px-3 sm:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm"
                inputClassName="w-full px-3 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                optionClassName="px-4 py-3 text-white hover:bg-yellow-400/20 cursor-pointer text-sm"
                iconClassName="text-yellow-300 flex-shrink-0 ml-2"
                maxHeight="max-h-52"
                autoFocus={false}
                closeOnSelect={true}
                hideSearch={false}
                dropUp={false}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-white/10 text-white rounded-xl px-3 sm:px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[110px] sm:min-w-[130px] text-sm"
            >
              <option value="all" className="bg-emerald-900">All Status</option>
              <option value="present" className="bg-emerald-900">✅ Present</option>
              <option value="absent" className="bg-emerald-900">❌ Absent</option>
              <option value="leave" className="bg-emerald-900">📋 Leave</option>
            </select>

            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200" />
              <input
                type="text"
                placeholder="Search teacher..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full bg-white/10 text-white rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-green-200 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetFilters}
                className="px-3 sm:px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm text-sm"
              >
                <X size={14} />
                <span className="hidden xs:inline">Reset</span>
              </button>
              <button
                onClick={fetchAttendanceRecords}
                className="px-3 sm:px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm text-sm"
              >
                <RefreshCw size={14} />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 sm:p-4 shadow-xl">
              <p className="text-green-100 text-xs sm:text-sm">{stat.label}</p>
              <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <p className="text-sm sm:text-base">Loading attendance records...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table View - Responsive */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="sticky top-0 z-10 bg-emerald-900/80 backdrop-blur">
                      <tr>
                        <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider w-12 sm:w-16">#</th>
                        <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider">Teacher Name</th>
                        <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Teacher ID</th>
                        <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                        <th className="p-2 sm:p-4 text-center text-yellow-300 font-semibold text-xs uppercase tracking-wider">Status</th>
                        <th className="p-2 sm:p-4 text-center text-yellow-300 font-semibold text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRecords.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 sm:p-8 text-center text-green-100">
                            {attendanceRecords.length === 0 ? (
                              <div className="space-y-2">
                                <Users size={32} className="mx-auto text-green-300/50" />
                                <p className="text-sm">No attendance records found for this campus</p>
                                <p className="text-xs text-green-200/60">Click the "+" button to mark attendance for today.</p>
                              </div>
                            ) : (
                              'No records match the current filters'
                            )}
                          </td>
                        </tr>
                      ) : (
                        paginatedRecords.map((record, index) => {
                          const statusConfig = getStatusBadge(record.attendance_status);
                          const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          });

                          return (
                            <tr
                              key={record.attendance_id}
                              className="border-t border-white/5 hover:bg-white/5 transition"
                            >
                              <td className="p-2 sm:p-4 text-green-100/60 font-mono text-xs sm:text-sm">
                                {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                              </td>
                              <td className="p-2 sm:p-4 text-white font-medium text-sm sm:text-base">
                                {record.teacher_name}
                              </td>
                              <td className="p-2 sm:p-4 text-green-100 font-mono text-xs sm:text-sm hidden sm:table-cell">
                                #{String(record.teacher_id).padStart(4, '0')}
                              </td>
                              <td className="p-2 sm:p-4 text-green-100 text-sm hidden md:table-cell">
                                {formattedDate}
                              </td>
                              <td className="p-2 sm:p-4 text-center">
                                <span className={`
                                  inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border
                                  ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}
                                `}>
                                  <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${statusConfig.dot}`} />
                                  <span className="hidden xs:inline">{statusConfig.label}</span>
                                </span>
                              </td>
                              <td className="p-2 sm:p-4 text-center">
                                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedRecord(record);
                                      setShowAttendanceModal(true);
                                    }}
                                    className="inline-flex items-center gap-1 sm:gap-2 rounded-xl border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 px-2 sm:px-4 py-1.5 sm:py-2 font-semibold text-yellow-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/30 hover:text-green-950 hover:from-yellow-400 hover:to-amber-500 text-xs sm:text-sm"
                                  >
                                    ✏️ <span className="hidden xs:inline">Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(record.attendance_id, record.teacher_name)}
                                    className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-600/20 border border-red-400/30 text-red-300 font-semibold shadow-lg backdrop-blur-md transition-all duration-300 hover:from-red-500 hover:to-rose-600 hover:text-white hover:shadow-red-500/40 hover:-translate-y-1 text-xs sm:text-sm"
                                  >
                                    🗑 <span className="hidden xs:inline">Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination - Responsive */}
              {filteredRecords.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 border-t border-white/10">
                  <div className="text-xs sm:text-sm text-green-100">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={16} className="text-white" />
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg transition text-sm ${
                              currentPage === pageNum
                                ? 'bg-yellow-400 text-green-950'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Floating Action Button - Responsive */}
        <button
          onClick={() => {
            setOpenModal(true);
            const initialAttendance: Record<number, 'present' | 'absent' | 'leave'> = {};
            teachers.forEach((teacher) => {
              initialAttendance[teacher.teacher_id] = 'absent';
            });
            setTeacherAttendance(initialAttendance);
            setAttendanceDate(new Date().toISOString().split('T')[0]);
          }}
          className="
            fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8
            z-50
            flex items-center gap-1.5 sm:gap-2
            px-4 sm:px-6 md:px-7 py-3 sm:py-4
            rounded-full
            bg-gradient-to-r from-yellow-400 to-amber-500
            text-green-950 font-bold
            tracking-wide
            shadow-xl shadow-amber-500/20
            hover:scale-105
            hover:shadow-amber-500/30
            active:scale-95
            transition-all
            duration-200
            cursor-pointer
            text-sm sm:text-base
          "
        >
          <Plus size={18} className="stroke-[3]" />
          <span className="hidden xs:inline">Mark Attendance</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      <AttendanceStatusModal
        open={showAttendanceModal}
        teacherName={selectedRecord?.teacher_name || ""}
        currentStatus={selectedRecord?.attendance_status as AttendanceStatus || "present"}
        loading={savingAttendance}
        onClose={() => setShowAttendanceModal(false)}
        onSave={async (status) => {
          try {
            setSavingAttendance(true);
            await teacherAttendanceService.updateAttendance(selectedRecord.attendance_id, status);
            await fetchAttendanceRecords();
            setShowAttendanceModal(false);
          } catch (error) {
            console.error(error);
          } finally {
            setSavingAttendance(false);
          }
        }}
      />

      <TeacherAttendanceModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        onSave={handleSaveAttendance}
        teachers={teachers}
        attendance={teacherAttendance}
        attendanceDate={attendanceDate}
        onDateChange={setAttendanceDate}
        onAttendanceChange={handleAttendanceChange}
        campusName={campusName}
      />
    </div>
  );
}