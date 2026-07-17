// components/Student/StudentDetailModal.tsx
import React from 'react';
import {
  X, User, Mail, Phone, Calendar, Clock, GraduationCap, 
  Building2, BookOpen, Users, FileUser, Pencil, Trash2, 
  PhoneCall, Venus, Medal, BadgeIcon, Layers3
} from 'lucide-react';
import type { StudentResponse } from '../../services/studentService';
import { BASE_URL } from '../../config/api';
import Portal from '../../components/common/Portal';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentResponse | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function StudentDetailModal({
  isOpen,
  onClose,
  student,
  onEdit,
  onDelete
}: StudentDetailModalProps) {
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

  if (!isOpen || !student) return null;

  const fullName = `${student.first_name} ${student.last_name}`;
  const baseUrl = import.meta.env.VITE_API_URL || BASE_URL;
  const imageUrl = student.profile_image_path 
    ? `${baseUrl}${student.profile_image_path}` 
    : '/avatar.png';

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-2 sm:p-3 md:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-3xl my-1 sm:my-2 md:my-4" onClick={e => e.stopPropagation()}>
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="cursor-pointer absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-white/10 text-white hover:bg-red-500/30 flex items-center justify-center transition"
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
              
              {/* Student ID Badge */}
              <div className="mt-2 flex justify-center">
                <span className="px-3 sm:px-4 py-1 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <BadgeIcon size={12} className="sm:w-[14px] sm:h-[14px]" />
                  {student.roll_number || `Student #${student.student_id}`}
                </span>
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
                      <span className="truncate">{student.email_address}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Phone size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>{student.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <PhoneCall size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="truncate">Emergency: {student.emergency_contact_number}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <FileUser size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>CNIC: {student.cnic}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Venus size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="capitalize">{student.gender}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Calendar size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>DOB: {new Date(student.date_of_birth).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="col-span-full mt-3 sm:mt-4">
                  <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <GraduationCap size={14} className="sm:w-4 sm:h-4" />
                    Academic Information
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Building2 size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Class: {student.class_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Users size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Section: {student.section_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Layers3 size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Batch: {student.batch_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Building2 size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Department: {student.department_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Building2 size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Campus: {student.campus_name || student.campus_id}</span>
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="col-span-full mt-3 sm:mt-4">
                  <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <Medal size={14} className="sm:w-4 sm:h-4" />
                    Qualifications
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Medal size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Highest Qualification: {student.last_previous_highest_qualification || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Shift & Joining */}
                <div className="col-span-full mt-3 sm:mt-4">
                  <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <Clock size={14} className="sm:w-4 sm:h-4" />
                    Shift & Joining
                  </h3>
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Clock size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span className="capitalize">Shift: {student.shift}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base">
                      <Calendar size={14} className="sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                      <span>Joined: {new Date(student.joining_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Extra Details */}
                {student.extra_details && (
                  <div className="col-span-full mt-3 sm:mt-4">
                    <h3 className="text-yellow-300 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                      <BookOpen size={14} className="sm:w-4 sm:h-4" />
                      Additional Notes
                    </h3>
                    <p className="text-white/80 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10 text-sm sm:text-base">
                      {student.extra_details}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions - Fixed */}
            <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-white/10">
              <button
                onClick={onDelete}
                className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition flex items-center justify-center gap-2 text-sm sm:text-base order-3 sm:order-1"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={onEdit}
                className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 transition flex items-center justify-center gap-2 text-sm sm:text-base order-2"
              >
                <Pencil size={16} />
                Edit
              </button>
              <button
                onClick={onClose}
                className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-sm sm:text-base order-1 sm:order-4"
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