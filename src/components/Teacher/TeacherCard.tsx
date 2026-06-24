import {
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  GraduationCap,
  Calendar,
  Clock
} from "lucide-react";

interface TeacherCardProps {
  id: string | number;
  image: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  department?: string;
  shift?: string;
  joiningDate?: string;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TeacherAndStudentCard({
  id,
  image,
  name,
  address,
  onViewDetails,
  onEdit,
  onDelete,
  phone,
  email,
  department,
  shift,
  joiningDate
}: TeacherCardProps) {
  return (
    <div
      key={id}
      className="
        group
        relative
        flex
        flex-col
        justify-between
        w-full
        max-w-md
        rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        p-5
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-yellow-400/40
        hover:shadow-2xl
      "
    >
      {/* Background Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />

      {/* Header Layout */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar Area */}
          <div className="relative shrink-0">
            <img
              src={image}
              alt={name}
              className="
                w-16
                h-16
                rounded-2xl
                object-cover
                border-2
                border-yellow-400
                shadow-md
                transition-transform
                duration-300
                group-hover:scale-105
              "
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
          </div>

          {/* Profile Name */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-widest text-yellow-400 uppercase opacity-80">
              Instructor
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">
              {name}
            </h2>
            {department && (
              <p className="text-xs text-emerald-300 flex items-center gap-1">
                <GraduationCap size={12} />
                {department}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 z-10">
          <button
            onClick={onEdit}
            className="
              p-2
              rounded-lg
              bg-yellow-400/20
              text-yellow-300
              hover:bg-yellow-400/30
              transition-colors
              cursor-pointer
            "
            title="Edit"
          >
            <Pencil size={14} />
          </button>

          <button
            onClick={onDelete}
            className="
              p-2
              rounded-lg
              bg-red-500/20
              text-red-300
              hover:bg-red-500/30
              transition-colors
              cursor-pointer
            "
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body Info */}
      <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-sm font-medium text-green-100">
        <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
          <Phone size={14} className="shrink-0 text-yellow-300" />
          <span className="tracking-wide">{phone}</span>
        </div>

        <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
          <Mail size={14} className="shrink-0 text-yellow-300" />
          <span className="truncate">{email}</span>
        </div>

        <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
          <MapPin size={14} className="shrink-0 text-yellow-300" />
          <span className="truncate">{address}</span>
        </div>

        {shift && (
          <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <Clock size={14} className="shrink-0 text-yellow-300" />
            <span className="truncate">{shift} Shift</span>
          </div>
        )}

        {joiningDate && (
          <div className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <Calendar size={14} className="shrink-0 text-yellow-300" />
            <span className="truncate">Joined: {new Date(joiningDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Footer Call To Action */}
      <button
        onClick={onViewDetails}
        className="
          mt-5
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-yellow-400
          to-amber-500
          text-green-950
          font-semibold
          text-sm
          tracking-wide
          flex
          items-center
          justify-center
          gap-1.5
          hover:scale-[1.01]
          brightness-100
          hover:brightness-105
          transition-all
          cursor-pointer
        "
      >
        <span>View Details</span>
        <ArrowUpRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}