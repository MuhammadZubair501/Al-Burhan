// TeacherDetailModal.tsx - FIXED
import {
  X, User, Mail, Phone, Calendar, Clock, GraduationCap, Building2, 
  BookOpen, Users, FileUser, Pencil, Trash2, PhoneCall, Venus, Medal,
} from 'lucide-react';
import { getImageUrl } from '../../config/api'; // ← FIXED IMPORT
import Portal from '../../components/common/Portal';
import React from 'react';

interface TeacherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: {
    teacher_id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string;
    gender: string;
    cnic_number: string;
    emergency_number: string;
    joining_date: string;
    highest_education: string;
    shift: string;
    profile_image_path: string | null;
    extra_details: string | null;
    campus_id: number;
    campus_name?: string;
    department_id: number;
    department_name?: string;
    sections: Array<{ section_id: number; section_name: string; class_name: string }>;
    subjects: Array<{ subject_id: number; subject_name: string }>;
  } | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TeacherDetailModal({
  isOpen,
  onClose,
  teacher,
  onEdit,
  onDelete
}: TeacherDetailModalProps) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
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
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !teacher) return null;

  const fullName = `${teacher.first_name} ${teacher.last_name}`;
  
  // ============================================
  // FIXED: Use getImageUrl from config
  // ============================================
  const imageUrl = getImageUrl(teacher.profile_image_path, '/avatar.png');

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-3xl my-1 sm:my-2 md:my-4" onClick={e => e.stopPropagation()}>
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-white/10 text-white hover:bg-red-500/30 flex items-center justify-center transition"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Header with Profile Image - Fixed */}
            <div className="flex-shrink-0 sticky top-0 z-10 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center border-b border-white/10">
              <div className="relative inline-block">
                <img
                  src={imageUrl}
                  alt={fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-400 shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/avatar.png';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <User size={14} className="sm:w-4 sm:h-4 text-emerald-900" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 w-full">
                <User size={18} className="sm:w-5 sm:h-5 text-yellow-300" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                  {fullName}
                </h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Personal Information */}
                <div className="col-span-full">
                  <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <User size={14} className="sm:w-4 sm:h-4" />
                    Personal Information
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Mail size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="truncate">{teacher.email_address}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Phone size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>{teacher.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <PhoneCall size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="truncate">Emergency: {teacher.emergency_number}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <FileUser size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>CNIC: {teacher.cnic_number}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Venus size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="capitalize">{teacher.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="col-span-full mt-3 sm:mt-4">
                  <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <GraduationCap size={14} className="sm:w-4 sm:h-4" />
                    Professional Information
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Calendar size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Joined: {new Date(teacher.joining_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Clock size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="capitalize">{teacher.shift} Shift</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Building2 size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="truncate">Campus: {teacher.campus_name || teacher.campus_id}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Building2 size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="truncate">Department: {teacher.department_name || teacher.department_id}</span>
                    </div>
                  </div>
                </div>

                {/* Sections & Subjects */}
                <div className="col-span-full mt-3 sm:mt-4">
                  <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <BookOpen size={14} className="sm:w-4 sm:h-4" />
                    Academic Assignments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-emerald-100 text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2">Sections</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {teacher.sections && teacher.sections.length > 0 ? (
                          teacher.sections.map((section) => (
                            <span
                              key={section.section_id}
                              className="px-2 sm:px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200 text-[10px] sm:text-xs"
                            >
                              {section.class_name} - {section.section_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/50 text-xs sm:text-sm">No sections assigned</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-emerald-100 text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2">Subjects</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {teacher.subjects && teacher.subjects.length > 0 ? (
                          teacher.subjects.map((subject) => (
                            <span
                              key={subject.subject_id}
                              className="px-2 sm:px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px] sm:text-xs"
                            >
                              {subject.subject_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/50 text-xs sm:text-sm">No subjects assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Qualifications Information */}
                <div className="col-span-full mt-3 sm:mt-4">
                  <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <Medal size={14} className="sm:w-4 sm:h-4" />
                    Qualifications
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Medal size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Highest Degree: {teacher.highest_education}</span>
                    </div>
                  </div>
                </div>

                {/* Extra Details */}
                {teacher.extra_details && (
                  <div className="col-span-full mt-3 sm:mt-4">
                    <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                      <Users size={14} className="sm:w-4 sm:h-4" />
                      Additional Notes
                    </h3>
                    <p className="text-white/80 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10 text-sm sm:text-base">
                      {teacher.extra_details}
                    </p>
                  </div>
                )}

                {/* Debug: Image Path */}
                <div className="col-span-full mt-3 sm:mt-4">
                  <div className="text-white/40 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
                    <p>Image Path: {teacher.profile_image_path || 'No image'}</p>
                    <p>Image URL: {imageUrl}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-white/10">
              <button
                onClick={onDelete}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition flex items-center justify-center gap-2 text-sm sm:text-base order-3 sm:order-1"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={onEdit}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 transition flex items-center justify-center gap-2 text-sm sm:text-base order-2"
              >
                <Pencil size={16} />
                Edit
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-sm sm:text-base order-1 sm:order-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.4);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.6);
        }
      `}</style>
    </Portal>
  );
}