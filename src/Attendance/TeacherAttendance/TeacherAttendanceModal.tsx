// TeacherAttendanceModal.tsx

import { useState, type JSX, useEffect } from "react";
import { X, Calendar, Users, Check, Clock, User } from "lucide-react";

type Teacher = {
  teacher_id: number;
  name: string;
};

type Status = 'present' | 'absent' | 'leave';

interface TeacherAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    attendance_date: string;
    attendance: Array<{ teacher_id: number; status: Status }>;
  }) => Promise<void>;
  teachers: Teacher[];
  attendance: Record<number, Status>;
  attendanceDate: string;
  onDateChange: (date: string) => void;
  onAttendanceChange: (teacherId: number, status: Status) => void;
  campusName?: string;
}

export default function TeacherAttendanceModal({
  isOpen,
  onClose,
  onSave,
  teachers,
  attendance,
  attendanceDate,
  onDateChange,
  onAttendanceChange,
  campusName
}: TeacherAttendanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(attendanceDate);

  // Prevent body scroll when modal is open
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

  // Keyboard shortcut - Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allMarked = teachers.every(
      (teacher) => attendance[teacher.teacher_id] !== undefined
    );

    if (!allMarked) {
      alert('Please mark attendance for all teachers.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        attendance_date: selectedDate,
        attendance: teachers.map((teacher) => ({
          teacher_id: teacher.teacher_id,
          status: attendance[teacher.teacher_id] || 'absent',
        })),
      });
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status: Status) => {
    return Object.values(attendance).filter((s) => s === status).length;
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

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
      // Removed onClick handler - modal only closes via close button or Escape key
    >
      <div className="w-full max-w-4xl max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] flex flex-col bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        
        {/* Header - Fixed */}
        <div className="flex-shrink-0 sticky top-0 z-10 bg-emerald-900/95 backdrop-blur-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-950" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white truncate">
                  Mark Attendance
                </h2>
                {campusName && (
                  <p className="text-[10px] sm:text-xs md:text-sm text-green-100 truncate">{campusName}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          
          {/* Date Picker - Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 backdrop-blur-xl bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-white font-medium text-sm sm:text-base">Date:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                onDateChange(e.target.value);
              }}
              className="w-full sm:w-auto bg-white/10 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
            />
          </div>

          {/* Stats - Responsive Grid */}
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

          {/* Teachers List - Responsive */}
          <div className="space-y-2 sm:space-y-3 pb-2">
            {teachers.map((teacher) => {
              const currentStatus = attendance[teacher.teacher_id] || 'absent';
              
              return (
                <div
                  key={teacher.teacher_id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 backdrop-blur-xl bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-200"
                >
                  {/* Teacher Info */}
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center border border-yellow-400/30 flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{teacher.name}</p>
                      <p className="text-green-100 text-[10px] sm:text-xs">ID: #{String(teacher.teacher_id).padStart(4, '0')}</p>
                    </div>
                  </div>

                  {/* Status Buttons - Responsive */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
                    {statusOptions.map((option) => {
                      const isActive = currentStatus === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onAttendanceChange(teacher.teacher_id, option.value)}
                          className={`
                            flex-1 sm:flex-none min-w-[60px] sm:min-w-[70px] md:min-w-[80px]
                            px-2 sm:px-3 md:px-4 
                            py-1.5 sm:py-2 
                            rounded-lg 
                            text-[10px] sm:text-xs md:text-sm 
                            font-medium 
                            transition-all duration-200
                            flex items-center justify-center gap-1 sm:gap-1.5
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 sticky bottom-0 bg-emerald-900/95 backdrop-blur-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-white/10">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg shadow-yellow-500/20"
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