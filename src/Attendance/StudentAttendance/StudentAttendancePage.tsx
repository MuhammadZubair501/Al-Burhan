// StudentAttendancePage.tsx – Full Script with List/Grid Toggle & Full Status Badges

import { Plus, Users, Calendar as CalendarIcon, Search, X, RefreshCw, ChevronLeft, ChevronRight, Filter, MessageSquareText, FileSpreadsheet, LayoutGrid, List } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import StudentAttendanceModal from "./StudentAttendanceModal";
import { studentAttendanceService } from "../../services/StudentAttendanceService";
import Swal from "sweetalert2";
import AttendanceStatusModal, { type AttendanceStatus } from "../AttendanceStatusModal";
import SearchDropdown from "../../components/custom/SearchDropdown";
import ImportAttendanceModal from "./ImportAttendanceModal";
import { getCampusId } from "../../components/ResetPassword/api/auth";


type AttendanceRecord = {
  attendance_id: number;
  student_id: number;
  student_name: string;
  attendance_status: 'present' | 'absent' | 'leave';
  date: string;
  section_id?: number;
  campus_id?: number;
  comments?: string;
};

type FilterState = {
  startDate: string;
  endDate: string;
  sectionId: number | '';
  status: 'present' | 'absent' | 'leave' | 'all';
  searchTerm: string;
};

export default function StudentAttendancePage() {
  // Use getCampusId() to get the campus ID consistently
  const campusId = getCampusId();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [campusName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [filters, setFilters] = useState<FilterState>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    sectionId: '',
    status: 'all',
    searchTerm: ''
  });

  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);

  const sectionOptions = sections.map(sec => ({
    id: sec.section_id,
    name: `${sec.class_name} - ${sec.section_name}`
  }));

  const selectedSectionName = filters.sectionId
    ? sectionOptions.find(opt => opt.id === filters.sectionId)?.name || ''
    : '';

  const handleSectionFilter = (name: string) => {
    const found = sectionOptions.find(opt => opt.name === name);
    if (found) {
      handleFilterChange('sectionId', found.id);
    } else {
      handleFilterChange('sectionId', '');
    }
    setIsSectionDropdownOpen(false);
  };

  useEffect(() => {
    if (campusId) {
      fetchSections();
      fetchAttendanceRecords();
    }
  }, [campusId]);

  useEffect(() => {
    applyFilters();
  }, [attendanceRecords, filters.sectionId, filters.status, filters.searchTerm]);

  const fetchSections = async () => {
    try {
      const data = await studentAttendanceService.getSectionsByCampus(campusId);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sections';
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || 
          errorMessage.includes('token') || errorMessage.includes('No token')) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again to continue.",
          icon: "warning",
          confirmButtonColor: "#fbbf24",
          background: "#1a2e2a",
          color: "#ffffff",
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#fbbf24",
          background: "#1a2e2a",
          color: "#ffffff",
        });
      }
    }
  };

  const fetchAttendanceRecords = async () => {
    if (!campusId || !filters.startDate || !filters.endDate) return;
    setLoading(true);
    try {
      const records = await studentAttendanceService.getAttendanceByDateRangeAndCampus(
        filters.startDate,
        filters.endDate,
        campusId,
        filters.sectionId || undefined
      );
      setAttendanceRecords(records);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch attendance records';
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || 
          errorMessage.includes('token') || errorMessage.includes('No token')) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again to continue.",
          icon: "warning",
          confirmButtonColor: "#fbbf24",
          background: "#1a2e2a",
          color: "#ffffff",
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#fbbf24",
          background: "#1a2e2a",
          color: "#ffffff",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendanceRecords];
    if (filters.sectionId) {
      filtered = filtered.filter(record => record.section_id === filters.sectionId);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(record => record.attendance_status === filters.status);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.student_name.toLowerCase().includes(searchLower)
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
      sectionId: '',
      status: 'all',
      searchTerm: ''
    }));
  };

  const handleSaveAttendance = async (data: {
    attendance_date: string;
    attendance: Array<{ student_id: number; status: 'present' | 'absent' | 'leave'; comments?: string }>;
    section_id?: number;
  }) => {
    try {
      const payload = {
        attendance_date: data.attendance_date,
        attendance: data.attendance,
        section_id: data.section_id,
        campus_id: campusId,
      };
      const response = await studentAttendanceService.saveAttendance(payload);
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

  const handleDelete = async (attendanceId: number, studentName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete attendance record for "${studentName}"?`,
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
      await studentAttendanceService.deleteAttendance(attendanceId);
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

  // Status badge with full label (used in both views)
  const getStatusBadge = (status: string) => {
    const configs = {
      present: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400', label: 'Present' },
      absent: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400', label: 'Absent' },
      leave: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Leave' }
    };
    const cfg = configs[status as keyof typeof configs] || configs.absent;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <span>{cfg.label}</span>
      </span>
    );
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
  ];

  // ---- Grid data: only dates present in filteredRecords ----
  const gridDates = useMemo(() => {
    const dateSet = new Set<string>();
    filteredRecords.forEach(r => dateSet.add(r.date));
    return Array.from(dateSet).sort();
  }, [filteredRecords]);

  const gridData = useMemo(() => {
    if (viewMode !== 'grid') return [];
    const map = new Map<number, { student_id: number; student_name: string; records: Record<string, AttendanceRecord> }>();
    filteredRecords.forEach(rec => {
      if (!map.has(rec.student_id)) {
        map.set(rec.student_id, {
          student_id: rec.student_id,
          student_name: rec.student_name,
          records: {}
        });
      }
      map.get(rec.student_id)!.records[rec.date] = rec;
    });
    return Array.from(map.values()).sort((a, b) => a.student_name.localeCompare(b.student_name));
  }, [filteredRecords, viewMode]);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-40 sm:w-56 h-40 sm:h-56 border-2 border-white rounded-full"></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Student Attendance"
          description={`Manage attendance records for ${campusName}`}
          Icon={Users}
        />

        {/* Filter Section */}
        <div className="mb-4 sm:mb-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
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

            <div className="flex-1 min-w-[180px]">
              <SearchDropdown
                label=""
                placeholder="All Sections"
                icon={<Filter size={16} className="text-yellow-300" />}
                options={sectionOptions}
                value={selectedSectionName}
                onChange={handleSectionFilter}
                isOpen={isSectionDropdownOpen}
                onToggle={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}
                onClose={() => setIsSectionDropdownOpen(false)}
                dropUp={false}
                hideSearch={false}
                className="w-full"
                triggerClassName="w-full px-3 sm:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm"
                dropdownClassName="w-full"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="cursor-pointer bg-white/10 text-white rounded-xl px-3 sm:px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[110px] sm:min-w-[130px] text-sm"
            >
              <option value="all" className="bg-emerald-900">All Status</option>
              <option value="present" className="bg-emerald-900">✅ Present</option>
              <option value="absent" className="bg-emerald-900">❌ Absent</option>
              <option value="leave" className="bg-emerald-900">📋 Leave</option>
            </select>

            <div className="relative flex-1 min-w-[160px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200" />
              <input
                type="text"
                placeholder="Search student..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full bg-white/10 text-white rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-green-200 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetFilters}
                className="cursor-pointer px-3 sm:px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center gap-1.5 sm:gap-2 text-sm"
              >
                <X size={14} /> <span className="hidden xs:inline">Reset</span>
              </button>
              <button
                onClick={fetchAttendanceRecords}
                className="cursor-pointer px-3 sm:px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition flex items-center gap-1.5 sm:gap-2 text-sm"
              >
                <RefreshCw size={14} /> <span className="hidden xs:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="cursor-pointer px-3 sm:px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition flex items-center gap-1.5 sm:gap-2 text-sm"
              >
                <FileSpreadsheet size={14} /> <span className="hidden xs:inline">Import</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats + View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
            {stats.map((stat, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 sm:p-4 shadow-xl">
                <p className="text-green-100 text-xs sm:text-sm">{stat.label}</p>
                <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
       <div className="mb-5 flex justify-end">
  <div className="flex gap-1 bg-white/10 rounded-xl p-1 border border-white/20">
    <button 
      onClick={() => setViewMode('list')} 
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${ viewMode === 'list' ? 'bg-yellow-400 text-green-950' : 'text-green-100 hover:bg-white/10' }`} 
    > 
      <List size={16} /> List 
    </button> 
    <button 
      onClick={() => setViewMode('grid')} 
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${ viewMode === 'grid' ? 'bg-yellow-400 text-green-950' : 'text-green-100 hover:bg-white/10' }`} 
    > 
      <LayoutGrid size={16} /> Grid 
    </button> 
  </div>
</div>


        {/* Table / Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <p className="text-sm sm:text-base">Loading attendance records...</p>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            {viewMode === 'list' ? (
              /* ========== LIST VIEW ========== */
              <>
                <div className="overflow-x-auto">
                  <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="sticky top-0 z-10 bg-emerald-900/80 backdrop-blur">
                        <tr>
                          <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider w-12 sm:w-16">#</th>
                          <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider">Student Name</th>
                          <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Roll #</th>
                          <th className="p-2 sm:p-4 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                          <th className="p-2 sm:p-4 text-center text-yellow-300 font-semibold text-xs uppercase tracking-wider">Status</th>
                          <th className="p-2 sm:p-4 text-center text-yellow-300 font-semibold text-xs uppercase tracking-wider">Comments</th>
                          <th className="p-2 sm:p-4 text-center text-yellow-300 font-semibold text-xs uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRecords.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-6 sm:p-8 text-center text-green-100">
                              {attendanceRecords.length === 0 ? (
                                <div className="space-y-2">
                                  <Users size={32} className="mx-auto text-green-300/50" />
                                  <p className="text-sm">No attendance records found for this campus</p>
                                  <p className="text-xs text-green-200/60">Click the "+" button to mark attendance for today.</p>
                                </div>
                              ) : 'No records match the current filters'}
                            </td>
                          </tr>
                        ) : (
                          paginatedRecords.map((record, index) => {
                            const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            });
                            return (
                              <tr key={record.attendance_id} className="border-t border-white/5 hover:bg-white/5 transition">
                                <td className="p-2 sm:p-4 text-green-100/60 font-mono text-xs sm:text-sm">
                                  {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                                </td>
                                <td className="p-2 sm:p-4 text-white font-medium text-sm sm:text-base">{record.student_name}</td>
                                <td className="p-2 sm:p-4 text-green-100 font-mono text-xs sm:text-sm hidden sm:table-cell">#{record.student_id}</td>
                                <td className="p-2 sm:p-4 text-green-100 text-sm hidden md:table-cell">{formattedDate}</td>
                                <td className="p-2 sm:p-4 text-center">
                                  {getStatusBadge(record.attendance_status)}
                                </td>
                                <td className="p-2 sm:p-4 text-center">
                                  {record.attendance_status === "leave" ? (
                                    <button
                                      onClick={() => {
                                        const comment = record.comments?.trim() || "No comment provided.";
                                        Swal.fire({
                                          title: "Comment",
                                          text: comment,
                                          icon: "info",
                                          confirmButtonColor: "#fbbf24",
                                          background: "#1a2e2a",
                                          color: "#ffffff",
                                          width: 400,
                                        });
                                      }}
                                      className="cursor-pointer inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-400/30 text-blue-300 font-semibold shadow-lg backdrop-blur-md transition-all duration-300 hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-blue-500/40 hover:-translate-y-1 text-xs sm:text-sm"
                                    >
                                      <MessageSquareText size={14} />
                                    </button>
                                  ) : (
                                    <span className="text-green-100/60 text-sm">-</span>
                                  )}
                                </td>
                                <td className="p-2 sm:p-4 text-center">
                                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedRecord(record);
                                        setShowStatusModal(true);
                                      }}
                                      className="cursor-pointer inline-flex items-center gap-1 sm:gap-2 rounded-xl border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 px-2 sm:px-4 py-1.5 sm:py-2 font-semibold text-yellow-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/30 hover:text-green-950 hover:from-yellow-400 hover:to-amber-500 text-xs sm:text-sm"
                                    >
                                      ✏️ <span className="hidden xs:inline">Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(record.attendance_id, record.student_name)}
                                      className="cursor-pointer inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-600/20 border border-red-400/30 text-red-300 font-semibold shadow-lg backdrop-blur-md transition-all duration-300 hover:from-red-500 hover:to-rose-600 hover:text-white hover:shadow-red-500/40 hover:-translate-y-1 text-xs sm:text-sm"
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
                {filteredRecords.length > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 border-t border-white/10">
                    <div className="text-xs sm:text-sm text-green-100">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="cursor-pointer p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft size={16} className="text-white" />
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) pageNum = i + 1;
                          else if (currentPage <= 3) pageNum = i + 1;
                          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                          else pageNum = currentPage - 2 + i;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg transition text-sm ${
                                currentPage === pageNum ? 'bg-yellow-400 text-green-950' : 'bg-white/10 hover:bg-white/20 text-white'
                              } cursor-pointer`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="cursor-pointer p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ========== GRID VIEW ========== */
              <div className="overflow-x-auto">
                <div className="max-h-[60vh] overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-10 bg-emerald-900/80 backdrop-blur">
                      <tr>
                        <th className="sticky left-0 z-20 bg-emerald-900/80 p-2 sm:p-3 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider min-w-[50px]">
                          #
                        </th>
                        <th className="sticky left-[50px] z-20 bg-emerald-900/80 p-2 sm:p-3 text-left text-yellow-300 font-semibold text-xs uppercase tracking-wider min-w-[150px]">
                          Student Name
                        </th>
                        {gridDates.map(date => (
                          <th key={date} className="p-2 sm:p-3 text-center text-yellow-300 font-semibold text-xs uppercase tracking-wider min-w-[100px]">
                            {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {gridData.length === 0 ? (
                        <tr>
                          <td colSpan={gridDates.length + 2} className="p-6 text-center text-green-100">
                            {filteredRecords.length === 0 ? (
                              <div className="space-y-2">
                                <Users size={32} className="mx-auto text-green-300/50" />
                                <p className="text-sm">No attendance records found for this campus</p>
                                <p className="text-xs text-green-200/60">Click the "+" button to mark attendance for today.</p>
                              </div>
                            ) : 'No records match the current filters'}
                          </td>
                        </tr>
                      ) : (
                        gridData.map((student, idx) => (
                          <tr key={student.student_id} className="border-t border-white/5 hover:bg-white/5 transition">
                            <td className="sticky left-0 z-10 bg-emerald-900/80 p-2 sm:p-3 text-green-100/60 font-mono text-xs text-center">
                              {idx + 1}
                            </td>
                            <td className="sticky left-[50px] z-10 bg-emerald-900/80 p-2 sm:p-3 text-white font-medium text-sm whitespace-nowrap">
                              {student.student_name}
                            </td>
                            {gridDates.map(date => {
                              const record = student.records[date];
                              if (!record) {
                                return (
                                  <td key={date} className="p-2 sm:p-3 text-center text-green-100/30 text-xs">
                                    -
                                  </td>
                                );
                              }
                              return (
                                <td key={date} className="p-2 sm:p-3 text-center">
                                  {getStatusBadge(record.attendance_status)}
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setOpenModal(true)}
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
        open={showStatusModal}
        teacherName={selectedRecord?.student_name || ""}
        currentStatus={selectedRecord?.attendance_status as AttendanceStatus || "present"}
        currentComment={selectedRecord?.comments || ""}
        loading={saving}
        onClose={() => setShowStatusModal(false)}
        onSave={async (status, comment) => {
          try {
            setSaving(true);
            await studentAttendanceService.updateAttendance(
              selectedRecord.attendance_id,
              status,
              comment
            );
            await fetchAttendanceRecords();
            setShowStatusModal(false);
          } catch (error) {
            console.error(error);
          } finally {
            setSaving(false);
          }
        }}
      />

      <StudentAttendanceModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveAttendance}
        campusId={campusId}
        campusName={campusName}
        initialDate={new Date().toISOString().split('T')[0]}
      />
      <ImportAttendanceModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        campusId={campusId}
        onImportSuccess={fetchAttendanceRecords}
      />
    </div>
  );
}