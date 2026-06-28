// TeacherAttendanceModal.tsx

import { useState, type JSX } from "react";
import { X, Calendar, Users, Check, Clock } from "lucide-react";

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

  const statusOptions: Array<{ value: Status; label: string; icon: JSX.Element; color: string }> = [
    { 
      value: 'present', 
      label: 'Present', 
      icon: <Check size={16} />, 
      color: 'bg-green-500 hover:bg-green-600' 
    },
    { 
      value: 'absent', 
      label: 'Absent', 
      icon: <X size={16} />, 
      color: 'bg-red-500 hover:bg-red-600' 
    },
    { 
      value: 'leave', 
      label: 'Leave', 
      icon: <Clock size={16} />, 
      color: 'bg-yellow-500 hover:bg-yellow-600' 
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
                <h2 className="text-xl font-bold text-white">
                  Mark Attendance
                </h2>
                {campusName && (
                  <p className="text-sm text-green-100">{campusName}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Picker */}
          <div className="flex items-center gap-4 backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-yellow-400" />
              <span className="text-white font-medium">Date:</span>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                onDateChange(e.target.value);
              }}
              className="bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Stats */}
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

          {/* Teachers List */}
          <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2">
            {teachers.map((teacher) => {
              const currentStatus = attendance[teacher.teacher_id] || 'absent';
              
              return (
                <div
                  key={teacher.teacher_id}
                  className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center border border-yellow-400/30">
                      <span className="text-yellow-400 font-semibold">
                        {teacher.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{teacher.name}</p>
                      <p className="text-green-100 text-sm">ID: #{String(teacher.teacher_id).padStart(4, '0')}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onAttendanceChange(teacher.teacher_id, option.value)}
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
            })}
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
              disabled={loading}
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