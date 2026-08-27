// StudentCard.tsx
import { Pencil, Trash2, Eye, MapPin, BadgeIcon, Power, PowerOff } from "lucide-react";
import type { StudentResponse } from "../../services/studentService";

interface StudentCardProps {
  id: string | number;
  image: string;
  name: string;
  address: string;
  rawData?: StudentResponse;
  onViewDetails?: (student: StudentResponse) => void;
  onEdit?: (student: StudentResponse) => void;
  onDelete?: (student: StudentResponse) => void;
  onToggleActive?: (student: StudentResponse) => void;
  onAdd?: () => void;
}

export default function StudentAndStudentCard({
  id,
  image,
  name,
  address,
  rawData,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleActive,
}: StudentCardProps) {
  // Explicitly check if is_active is true or 1 (from database)
  const isActive = rawData?.is_active === true || rawData?.is_active === 1;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      {/* Decorative Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/10 blur-3xl rounded-full" />
      </div>

      {/* Student Badge */}
      <div className="absolute left-4 top-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          isActive 
            ? 'bg-yellow-400/20 border-yellow-400/30 text-yellow-300' 
            : 'bg-red-500/20 border-red-500/30 text-red-300'
        }`}>
          {isActive ? 'Active Student' : 'Inactive Student'}
        </span>
      </div>

      {/* Actions */}
      <div className="absolute right-4 top-4 flex gap-2">
        {/* Toggle Active/Inactive Button */}
        <button
          onClick={() => rawData && onToggleActive?.(rawData)}
          className={`cursor-pointer p-2 rounded-xl transition ${
            isActive 
              ? "bg-white/10 text-green-300 hover:bg-green-500/20" 
              : "bg-white/10 text-red-300 hover:bg-red-500/20"
          }`}
          title={isActive ? "Deactivate Student" : "Activate Student"}
        >
          {isActive ? <Power size={16} /> : <PowerOff size={16} />}
        </button>
        <button
          onClick={() => rawData && onEdit?.(rawData)}
          className="cursor-pointer p-2 rounded-xl bg-white/10 text-yellow-300 hover:bg-yellow-400/20 transition"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => rawData && onDelete?.(rawData)}
          className="cursor-pointer p-2 rounded-xl bg-white/10 text-red-300 hover:bg-red-500/20 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mt-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xl opacity-30" />
          <img
            src={image}
            alt={name}
            className="relative w-28 h-28 rounded-full object-cover border-4 border-yellow-400 ring-4 ring-white/10 shadow-2xl"
          />
        </div>
      </div>

      {/* Name */}
      <div className="text-center mt-5">
        <h2 className="text-xl font-bold text-white">{name}</h2>
        <div className="mt-3 flex justify-center">
          <span className="px-4 py-1 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-sm flex items-center gap-2">
            <BadgeIcon size={14} />
            {id}
          </span>
        </div>
      </div>

      {/* Address */}
      <div className="mt-4 flex justify-center items-center gap-2 text-green-100 text-sm">
        <MapPin size={16} className="text-yellow-300" />
        <span>{address}</span>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
          <p className="text-xs text-green-200">Class</p>
          <p className="text-white font-semibold">{rawData?.class_name || 'N/A'}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
          <p className="text-xs text-green-200">Section</p>
          <p className="text-white font-semibold">{rawData?.section_name || 'N/A'}</p>
        </div>
      </div>

      {/* View Button */}
      <button
        onClick={() => rawData && onViewDetails?.(rawData)}
        className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg z-100 cursor-pointer"
      >
        <Eye size={18} />
        View Student
      </button>
    </div>
  );
}