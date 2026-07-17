// components/student/StudentAttendanceModal.tsx

import { useState, useEffect, type JSX } from "react";
import { X, Calendar, Users, Check, Clock, Filter, User, MessageSquare } from "lucide-react";
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
    attendance: Array<{ student_id: number; status: Status; comments?: string }>;
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
  const [studentComments, setStudentComments] = useState<Record<number, string>>({});

  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);

  const sectionOptions = sections.map(sec => ({
    id: sec.section_id,
    name: `${sec.class_name} - ${sec.section_name}`
  }));

  const selectedSectionName = selectedSection
    ? sectionOptions.find(opt => opt.id === selectedSection)?.name || ''
    : '';

  const handleSectionSelect = (name: string) => {
    const found = sectionOptions.find(opt => opt.name === name);
    if (found) {
      setSelectedSection(found.id);
      setIsSectionDropdownOpen(false);
    }
  };

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      setStudentComments({});
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
      const initial: Record<number, Status> = {};
      data.forEach(s => { initial[s.student_id] = 'absent'; });
      setStudentStatus(initial);
      setStudentComments({});
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Handle status change – clear comment if not 'leave'
  const handleStatusChange = (studentId: number, status: Status) => {
    setStudentStatus(prev => ({ ...prev, [studentId]: status }));
    // If status is not 'leave', clear any comment for that student
    if (status !== 'leave') {
      setStudentComments(prev => {
        const newComments = { ...prev };
        delete newComments[studentId];
        return newComments;
      });
    }
  };

  const handleCommentChange = (studentId: number, comment: string) => {
    setStudentComments(prev => ({ ...prev, [studentId]: comment }));
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
          // Only send comment if status is 'leave'
          comments: studentStatus[s.student_id] === 'leave' ? (studentComments[s.student_id] || '') : undefined
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

  const statusOptions: Array<{ value: Status; label: string; icon: JSX.Element; color: string; activeColor: string }> = [
    { 
      value: 'present', 
      label: 'Present', 
      icon: <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 
      color: 'bg-white/5 text-green-100 hover:bg-white/10 hover:text-white',
      activeColor: 'bg-green-500 text-white shadow-lg shadow-green-500/30'
    },
    { 
      value: 'absent', 
      label: 'Absent', 
      icon: <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 
      color: 'bg-white/5 text-green-100 hover:bg-white/10 hover:text-white',
      activeColor: 'bg-red-500 text-white shadow-lg shadow-red-500/30'
    },
    { 
      value: 'leave', 
      label: 'Leave', 
      icon: <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, 
      color: 'bg-white/5 text-green-100 hover:bg-white/10 hover:text-white',
      activeColor: 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
    },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="w-full max-w-4xl max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] flex flex-col bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 sticky top-0 z-10 bg-emerald-900/95 backdrop-blur-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-950" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white truncate">
                  Mark Student Attendance
                </h2>
                {campusName && (
                  <p className="text-[10px] sm:text-xs md:text-sm text-green-100 truncate">{campusName}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          
          {/* Section + Date */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 backdrop-blur-xl bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-white font-medium text-sm sm:text-base">Section:</span>
            </div>
            <div className="w-full sm:w-48 md:w-56 lg:w-64">
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
                triggerClassName="w-full px-3 sm:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all text-sm"
                dropdownClassName="w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-white font-medium text-sm sm:text-base">Date:</span>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="flex-1 sm:flex-none bg-white/10 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Stats */}
          {students.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 sm:p-3 text-center">
                <p className="text-green-400 font-bold text-lg sm:text-xl md:text-2xl">{getStatusCount('present')}</p>
                <p className="text-green-100 text-[10px] sm:text-xs md:text-sm">Present</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 sm:p-3 text-center">
                <p className="text-red-400 font-bold text-lg sm:text-xl md:text-2xl">{getStatusCount('absent')}</p>
                <p className="text-green-100 text-[10px] sm:text-xs md:text-sm">Absent</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2 sm:p-3 text-center">
                <p className="text-yellow-400 font-bold text-lg sm:text-xl md:text-2xl">{getStatusCount('leave')}</p>
                <p className="text-green-100 text-[10px] sm:text-xs md:text-sm">Leave</p>
              </div>
            </div>
          )}

          {/* Students List */}
          <div className="max-h-[40vh] sm:max-h-[45vh] md:max-h-[50vh] overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2">
            {students.length === 0 ? (
              <div className="text-center text-green-100 py-6 sm:py-8 text-sm sm:text-base">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                Select a section to load students.
              </div>
            ) : (
              students.map((student) => {
                const currentStatus = studentStatus[student.student_id] || 'absent';
                const fullName = `${student.first_name} ${student.last_name}`;
                const comment = studentComments[student.student_id] || '';
                const showComment = currentStatus === 'leave'; // only show when status is 'leave'

                return (
                  <div
                    key={student.student_id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 backdrop-blur-xl bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-200"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[180px]">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center border border-yellow-400/30 flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm sm:text-base truncate">{fullName}</p>
                        <p className="text-green-100 text-[10px] sm:text-xs">Roll #: {student.roll_number || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                      {statusOptions.map((option) => {
                        const isActive = currentStatus === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleStatusChange(student.student_id, option.value)}
                            className={`
                              flex-1 sm:flex-none min-w-[55px] sm:min-w-[65px] md:min-w-[75px]
                              px-2 sm:px-3 md:px-4 
                              py-1.5 sm:py-2 
                              rounded-lg 
                              text-[10px] sm:text-xs md:text-sm 
                              font-medium 
                              transition-all duration-200
                              flex items-center justify-center gap-1 sm:gap-1.5
                              cursor-pointer
                              ${isActive ? option.activeColor : option.color}
                              ${isActive ? 'scale-105' : 'scale-100'}
                            `}
                          >
                            {option.icon}
                            <span className="hidden xs:inline">{option.label}</span>
                            <span className="xs:hidden">
                              {option.value === 'present' ? 'P' : option.value === 'absent' ? 'A' : 'L'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Comment Input - only shown when status is 'leave' */}
                    {showComment && (
                      <div className="flex items-center gap-1 w-full sm:w-auto sm:ml-2">
                        <MessageSquare className="w-4 h-4 text-yellow-400 flex-shrink-0 hidden sm:block" />
                        <input
                          type="text"
                          placeholder="Reason for leave..."
                          value={comment}
                          onChange={(e) => handleCommentChange(student.student_id, e.target.value)}
                          className="w-full sm:w-28 md:w-36 bg-white/10 text-white rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 border border-yellow-400/30 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-xs sm:text-sm placeholder-green-200/50"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 sticky bottom-0 bg-emerald-900/95 backdrop-blur-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-white/10">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || students.length === 0}
              className="cursor-pointer w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg shadow-yellow-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-green-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Submit Attendance'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}