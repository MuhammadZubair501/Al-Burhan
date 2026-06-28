// StudentAttendanceModal.tsx

import { useState, useEffect, type JSX } from "react";
import { X, Calendar, Users, Check, Clock, Filter } from "lucide-react";
import { studentAttendanceService } from "../../services/StudentAttendanceService";
import SearchDropdown from "../../components/custom/SearchDropdown";

type Student = {
  student_id: number;
  first_name: string;
  last_name: string;
  roll_number?: string;
};

type Status = 'present' | 'absent' | 'leave';

interface StudentAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    attendance_date: string;
    attendance: Array<{ student_id: number; status: Status }>;
    section_id?: number;
  }) => Promise<void>;
  campusId: number;
  campusName?: string;
  initialDate?: string;
}

export default function StudentAttendanceModal({
  isOpen,
  onClose,
  onSave,
  campusId,
  campusName,
  initialDate
}: StudentAttendanceModalProps) {
const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(
    initialDate || new Date().toISOString().split('T')[0]
  );
  const [studentStatus, setStudentStatus] = useState<Record<number, Status>>({});
  
  // Dropdown open state
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);

// ... existing useEffect for fetching sections ...

  // Map sections to SearchDropdown options
  const sectionOptions = sections.map(sec => ({
    id: sec.section_id,
    name: `${sec.class_name} - ${sec.section_name}`
  }));

  // Get display name for selected section
  const selectedSectionName = selectedSection
    ? sectionOptions.find(opt => opt.id === selectedSection)?.name || ''
    : '';

  // Handle section selection from dropdown
  const handleSectionSelect = (name: string) => {
    const found = sectionOptions.find(opt => opt.name === name);
    if (found) {
      setSelectedSection(found.id);
      setIsSectionDropdownOpen(false);
    }
  };




  // Load sections on mount
  useEffect(() => {
    if (isOpen && campusId) {
      fetchSections();
    }
  }, [isOpen, campusId]);

  // Load students when section changes
  useEffect(() => {
    if (selectedSection) {
      fetchStudents(selectedSection);
    } else {
      setStudents([]);
      setStudentStatus({});
    }
  }, [selectedSection]);

  const fetchSections = async () => {
    try {
      const data = await studentAttendanceService.getSectionsByCampus(campusId);
      setSections(data);
      if (data.length > 0) {
        setSelectedSection(data[0].section_id);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchStudents = async (sectionId: number) => {
    try {
      const data = await studentAttendanceService.getStudentsBySection(sectionId);
      setStudents(data);
      // Initialize all as absent
      const initial: Record<number, Status> = {};
      data.forEach(s => { initial[s.student_id] = 'absent'; });
      setStudentStatus(initial);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleStatusChange = (studentId: number, status: Status) => {
    setStudentStatus(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) {
      alert('Please select a section.');
      return;
    }
    const allMarked = students.every(s => studentStatus[s.student_id] !== undefined);
    if (!allMarked) {
      alert('Please mark attendance for all students.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        attendance_date: attendanceDate,
        attendance: students.map(s => ({
          student_id: s.student_id,
          status: studentStatus[s.student_id] || 'absent',
        })),
        section_id: selectedSection,
      });
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status: Status) => {
    return Object.values(studentStatus).filter(s => s === status).length;
  };

  const statusOptions: Array<{ value: Status; label: string; icon: JSX.Element; color: string }> = [
    { value: 'present', label: 'Present', icon: <Check size={16} />, color: 'bg-green-500 hover:bg-green-600' },
    { value: 'absent', label: 'Absent', icon: <X size={16} />, color: 'bg-red-500 hover:bg-red-600' },
    { value: 'leave', label: 'Leave', icon: <Clock size={16} />, color: 'bg-yellow-500 hover:bg-yellow-600' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 rounded-3xl border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-emerald-900/80 backdrop-blur px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Users size={24} className="text-green-950" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mark Student Attendance</h2>
                {campusName && <p className="text-sm text-green-100">{campusName}</p>}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Selector + Date */}
               <div className="flex flex-wrap items-center gap-4 backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-yellow-400" />
            <span className="text-white font-medium">Section:</span>
          </div>
          <div className="w-64">
            <SearchDropdown
              label=""
              placeholder="Select Section"
              icon={<Filter size={16} className="text-yellow-300" />}
              options={sectionOptions}
              value={selectedSectionName}
              onChange={handleSectionSelect}
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

          <div className="flex items-center gap-2 ml-auto">
            <Calendar size={20} className="text-yellow-400" />
            <span className="text-white font-medium">Date:</span>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
          {/* Stats */}
          {students.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                <p className="text-green-400 font-bold text-2xl">{getStatusCount('present')}</p>
                <p className="text-green-100 text-sm">Present</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                <p className="text-red-400 font-bold text-2xl">{getStatusCount('absent')}</p>
                <p className="text-green-100 text-sm">Absent</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
                <p className="text-yellow-400 font-bold text-2xl">{getStatusCount('leave')}</p>
                <p className="text-green-100 text-sm">Leave</p>
              </div>
            </div>
          )}

          {/* Students List */}
          <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2">
            {students.length === 0 ? (
              <div className="text-center text-green-100 py-8">Select a section to load students.</div>
            ) : (
              students.map((student) => {
                const currentStatus = studentStatus[student.student_id] || 'absent';
                const fullName = `${student.first_name} ${student.last_name}`;
                return (
                  <div
                    key={student.student_id}
                    className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center border border-yellow-400/30">
                        <span className="text-yellow-400 font-semibold">{fullName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{fullName}</p>
                        <p className="text-green-100 text-sm">Roll #: {student.roll_number || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleStatusChange(student.student_id, option.value)}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all
                            flex items-center gap-1.5
                            ${currentStatus === option.value
                              ? `${option.color} text-white shadow-lg scale-105`
                              : 'bg-white/5 text-green-100 hover:bg-white/10 hover:text-white'
                            }
                          `}
                        >
                          {option.icon}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || students.length === 0}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Submit Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}