// ClassCard.tsx
import { 
  Users, 
  GraduationCap, 
  School, 
  DoorOpen, 
  Pencil, 
  Trash2, 
  Calendar, 
  Clock 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Class = {
  class_id: number;
  class_name: string;
  department_id: number;
  department_name: string;
  batch_id: number;
  batch_name: string;
  shift: string;
  student_count?: string;
  total_sections?: string;
  created_at?: string;
  updated_at?: string;
};

interface ClassCardProps {
  item: Class;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ClassCard({ item, onEdit, onDelete }: ClassCardProps) {
  const navigate = useNavigate();
// ClassCard.tsx - Update the handleViewSections function
const handleViewSections = () => {
  // Navigate to section page with class ID
  navigate(`/sections/${item.class_id}`);
};

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        bg-gradient-to-b from-white/15 to-white/5
        backdrop-blur-xl
        border
        border-white/15
        rounded-3xl
        p-6
        shadow-xl
        hover:border-yellow-400/40
        hover:shadow-yellow-400/5
        hover:-translate-y-1.5
        transition-all
        duration-300
        flex
        flex-col
        justify-between
      "
    >
      {/* Decorative background glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header Section */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 transform group-hover:scale-105 transition-transform duration-300">
              <School className="text-green-950" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide group-hover:text-yellow-300 transition-colors duration-300">
                {item.class_name}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-green-200/80">
                <GraduationCap size={14} className="text-yellow-400/80" />
                <span>{item.department_name}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
              className="p-2 cursor-pointer rounded-xl bg-white/5 border border-white/10 text-yellow-300 hover:bg-yellow-400/20 hover:border-yellow-400/30 transition-all"
            >
              <Pencil size={15} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              className="p-2 cursor-pointer rounded-xl bg-white/5 border border-white/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Middle Info Badges */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-medium text-green-100">
            <Clock size={13} className="text-yellow-400" />
            <span>Shift: {item.shift}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-medium text-green-100">
            <Calendar size={13} className="text-yellow-400" />
            <span>Batch: {item.batch_name}</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4 group/stat hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-yellow-400/90">
              <Users size={16} />
              <span className="text-xs font-medium tracking-wide uppercase opacity-80">Students</span>
            </div>
            <p className="text-white text-2xl font-black mt-1.5 tracking-tight">
              {item.student_count || "0"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/5 p-4 group/stat hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-yellow-400/90">
              <DoorOpen size={16} />
              <span className="text-xs font-medium tracking-wide uppercase opacity-80">Sections</span>
            </div>
            <p className="text-white text-2xl font-black mt-1.5 tracking-tight">
              {item.total_sections || "0"}
            </p>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={handleViewSections}
        className="
          relative
          z-10
          mt-6
          w-full
          py-3.5
          rounded-2xl
          bg-gradient-to-r
          from-yellow-400
          to-amber-500
          text-green-950
          font-bold
          tracking-wide
          shadow-lg
          shadow-amber-500/10
          hover:shadow-amber-500/20
          active:scale-[0.98]
          transition-all
          cursor-pointer
        "
      >
        View Class Sections
      </button>
    </div>
  );
}