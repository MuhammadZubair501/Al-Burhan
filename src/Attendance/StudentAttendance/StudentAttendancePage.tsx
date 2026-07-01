// StudentAttendancePage.tsx

import { Plus, Users, Calendar as CalendarIcon, Search, X, RefreshCw, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import StudentAttendanceModal from "./StudentAttendanceModal";
import { studentAttendanceService } from "../../services/StudentAttendanceService";
import Swal from "sweetalert2";
import AttendanceStatusModal, { type AttendanceStatus } from "../AttendanceStatusModal";
import SearchDropdown from "../../components/custom/SearchDropdown";

type AttendanceRecord = {
  attendance_id: number;
  student_id: number;
  student_name: string;
  attendance_status: 'present' | 'absent' | 'leave';
  date: string;
  section_id?: number;
  campus_id?: number;
};


type FilterState = {
  startDate: string;
  endDate: string;
  sectionId: number | '';
  status: 'present' | 'absent' | 'leave' | 'all';
  searchTerm: string;
};

export default function StudentAttendancePage() {
  const campusId = (window as any).CampusID || 1;

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [campusName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    sectionId: '',
    status: 'all',
    searchTerm: ''
  });

const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);

// Map sections to dropdown options
const sectionOptions = sections.map(sec => ({
  id: sec.section_id,
  name: `${sec.class_name} - ${sec.section_name}`
}));

// Get display name for currently filtered section
const selectedSectionName = filters.sectionId
  ? sectionOptions.find(opt => opt.id === filters.sectionId)?.name || ''
  : '';

const handleSectionFilter = (name: string) => {
  const found = sectionOptions.find(opt => opt.name === name);
  if (found) {
    handleFilterChange('sectionId', found.id);
  } else {
    handleFilterChange('sectionId', ''); // if cleared
  }
  setIsSectionDropdownOpen(false);
};

  // Load sections on mount
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
    attendance: Array<{ student_id: number; status: 'present' | 'absent' | 'leave' }>;
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

  const getStatusBadge = (status: string) => {
    const configs = {
      present: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400', label: 'Present' },
      absent: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400', label: 'Absent' },
      leave: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Leave' }
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
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 border-2 border-white rounded-full"></div>
      </div>

      <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
        <PageHeader
          title="Student Attendance"
          description={`Manage attendance records for ${campusName}`}
          Icon={Users}
        />

        {/* Filter Section */}
        <div className="mb-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-yellow-400" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="bg-white/10 text-white rounded-xl px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-36"
              />
              <span className="text-green-100">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="bg-white/10 text-white rounded-xl px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-36"
              />
            </div>

            {/* Section Filter */}
           <div className="w-64">
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
    triggerClassName="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm"
    dropdownClassName="w-full"
  />
</div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-white/10 text-white rounded-xl px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[130px]"
            >
              <option value="all" className="bg-emerald-900">All Status</option>
              <option value="present" className="bg-emerald-900">✅ Present</option>
              <option value="absent" className="bg-emerald-900">❌ Absent</option>
              <option value="leave" className="bg-emerald-900">📋 Leave</option>
            </select>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200" />
              <input
                type="text"
                placeholder="Search student..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full bg-white/10 text-white rounded-xl pl-10 pr-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Buttons */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center gap-2"
            >
              <X size={16} /> Reset
            </button>
            <button
              onClick={fetchAttendanceRecords}
              className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition flex items-center gap-2"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl">
              <p className="text-green-100 text-sm">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <p>Loading attendance records...</p>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-emerald-900/80 backdrop-blur">
                    <tr>
                      <th className="p-4 text-left text-yellow-300 font-semibold text-sm uppercase tracking-wider w-16">#</th>
                      <th className="p-4 text-left text-yellow-300 font-semibold text-sm uppercase tracking-wider">Student Name</th>
                      <th className="p-4 text-left text-yellow-300 font-semibold text-sm uppercase tracking-wider">Roll #</th>
                      <th className="p-4 text-left text-yellow-300 font-semibold text-sm uppercase tracking-wider">Date</th>
                      <th className="p-4 text-center text-yellow-300 font-semibold text-sm uppercase tracking-wider">Status</th>
                      <th className="p-4 text-center text-yellow-300 font-semibold text-sm uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-green-100">
                          {attendanceRecords.length === 0 ? (
                            <div className="space-y-2">
                              <Users size={40} className="mx-auto text-green-300/50" />
                              <p>No attendance records found for this campus</p>
                              <p className="text-sm text-green-200/60">Click the "+" button to mark attendance for today.</p>
                            </div>
                          ) : 'No records match the current filters'}
                        </td>
                      </tr>
                    ) : (
                      paginatedRecords.map((record, index) => {
                        const statusConfig = getStatusBadge(record.attendance_status);
                        const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        });
                        return (
                          <tr key={record.attendance_id} className="border-t border-white/5 hover:bg-white/5 transition">
                            <td className="p-4 text-green-100/60 font-mono text-sm">
                              {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                            </td>
                            <td className="p-4 text-white font-medium">{record.student_name}</td>
                            <td className="p-4 text-green-100 font-mono">#{record.student_id}</td>
                            <td className="p-4 text-green-100">{formattedDate}</td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
                                <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowStatusModal(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 px-4 py-2 font-semibold text-yellow-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/30 hover:text-green-950 hover:from-yellow-400 hover:to-amber-500"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(record.attendance_id, record.student_name)}
                                className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-600/20 border border-red-400/30 text-red-300 font-semibold shadow-lg backdrop-blur-md transition-all duration-300 hover:from-red-500 hover:to-rose-600 hover:text-white hover:shadow-red-500/40 hover:-translate-y-1"
                              >
                                🗑 Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {filteredRecords.length > itemsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <div className="text-sm text-green-100">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={18} className="text-white" />
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
                          className={`px-3 py-1 rounded-lg transition ${currentPage === pageNum ? 'bg-yellow-400 text-green-950' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={18} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setOpenModal(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-extrabold tracking-wide shadow-xl shadow-amber-500/20 hover:scale-105 hover:shadow-amber-500/30 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Plus size={20} className="stroke-[3]" />
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* Status Edit Modal (reuse AttendanceStatusModal) */}
      <AttendanceStatusModal
        open={showStatusModal}
        teacherName={selectedRecord?.student_name || ""} // reuse teacherName prop but we can rename if needed
        currentStatus={selectedRecord?.attendance_status as AttendanceStatus || "present"}
        loading={saving}
        onClose={() => setShowStatusModal(false)}
        onSave={async (status) => {
          try {
            setSaving(true);
            await studentAttendanceService.updateAttendance(selectedRecord.attendance_id, status);
            await fetchAttendanceRecords();
            setShowStatusModal(false);
          } catch (error) {
            console.error(error);
          } finally {
            setSaving(false);
          }
        }}
      />

      {/* Attendance Modal */}
      <StudentAttendanceModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveAttendance}
        campusId={campusId}
        campusName={campusName}
        initialDate={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
}