// components/Student/StudentDetailModal.tsx
import {
  X, User, Mail, Phone, Calendar, Clock, GraduationCap, 
  Building2, BookOpen, Users, FileUser, Pencil, Trash2, 
  PhoneCall, Venus, Medal, BadgeIcon, Layers3
} from 'lucide-react';
import type { StudentResponse } from '../../services/studentService';

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
  if (!isOpen || !student) return null;

  const fullName = `${student.first_name} ${student.last_name}`;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://192.9.210.50:5000';
  const imageUrl = student.profile_image_path 
    ? `${baseUrl}${student.profile_image_path}` 
    : '/avatar.png';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6" onClick={(e) => e.stopPropagation()}>
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border border-white/20 shadow-2xl overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-red-500/30 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>

          {/* Header with Profile Image */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
            <div className="relative inline-block">
              <img
                src={imageUrl}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/avatar.png';
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                <User size={16} className="text-emerald-900" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 w-full">
              <User size={24} className="text-yellow-300" /> 
              <h2 className="text-2xl font-bold text-white">{fullName}</h2>
            </div>
            
            {/* Student ID Badge */}
            <div className="mt-2 flex justify-center">
              <span className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-sm flex items-center gap-2">
                <BadgeIcon size={14} />
                {student.roll_number || `Student #${student.student_id}`}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="col-span-full">
                <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User size={16} />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-white/80">
                    <Mail size={16} className="text-yellow-300" />
                    <span>{student.email_address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Phone size={16} className="text-yellow-300" />
                    <span>{student.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <PhoneCall size={16} className="text-yellow-300" />
                    <span>Emergency: {student.emergency_contact_number}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <FileUser size={16} className="text-yellow-300" />
                    <span>CNIC: {student.cnic}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Venus size={16} className="text-yellow-300" />
                    <span className="flex items-center gap-1 capitalize">
                      {student.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Calendar size={16} className="text-yellow-300" />
                    <span>Date of Birth: {new Date(student.date_of_birth).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="col-span-full mt-4">
                <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <GraduationCap size={16} />
                  Academic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-white/80">
                    <Building2 size={16} className="text-yellow-300" />
                    <span>Class: {student.class_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Users size={16} className="text-yellow-300" />
                    <span>Section: {student.section_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Layers3 size={16} className="text-yellow-300" />
                    <span>Batch: {student.batch_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Building2 size={16} className="text-yellow-300" />
                    <span>Department: {student.department_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Building2 size={16} className="text-yellow-300" />
                    <span>Campus: {student.campus_name || student.campus_id}</span>
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="col-span-full mt-4">
                <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Medal size={16} />
                  Qualifications
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-white/80">
                    <Medal size={16} className="text-yellow-300" />
                    <span>Highest Qualification: {student.last_previous_highest_qualification || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Shift & Joining */}
              <div className="col-span-full mt-4">
                <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock size={16} />
                  Shift & Joining
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-white/80">
                    <Clock size={16} className="text-yellow-300" />
                    <span>Shift: {student.shift.charAt(0).toUpperCase() + student.shift.slice(1)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Calendar size={16} className="text-yellow-300" />
                    <span>Joined: {new Date(student.joining_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Extra Details */}
              {student.extra_details && (
                <div className="col-span-full mt-4">
                  <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen size={16} />
                    Additional Notes
                  </h3>
                  <p className="text-white/80 bg-white/5 p-3 rounded-xl border border-white/10">
                    {student.extra_details}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-black/20 flex justify-end gap-3 border-t border-white/10">
            <button
              onClick={onDelete}
              className="px-6 py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={onEdit}
              className="px-6 py-2.5 rounded-xl bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 transition flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
    </div>
  );
}