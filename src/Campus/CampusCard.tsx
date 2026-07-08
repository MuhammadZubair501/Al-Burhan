import { 
  Pencil, 
  Trash2, 
  MapPin, 
  ExternalLink, 
  Phone, 
  PocketKnife, 
  Users, 
  GraduationCap 
} from 'lucide-react';

interface Campus {
  campus_id: string | number;
  campus_name: string;
  is_main_campus: boolean;
  has_morning_shift: boolean;
  has_evening_shift: boolean;
  address: string;
  location: string;
  phone_number: string;
  poc_name: string;
  detail?: string;
  students?: number;
  teachers?: number;
}

interface CampusCardProps {
  campus: Campus;
  onEdit: (campus: Campus) => void;
  onDelete: (id: string | number) => void;
  onOpenLocation: (location: string) => void;
  onViewDashboard: (id: string | number) => void;
}

export default function CampusCard({ 
  campus, 
  onEdit, 
  onDelete, 
  onOpenLocation, 
  onViewDashboard 
}: CampusCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl sm:rounded-3xl
        bg-white/[0.08]
        backdrop-blur-xl
        border
        border-white/15
        p-4 sm:p-5 md:p-6
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
        transition-all
        duration-300
        w-full min-w-0

      "
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl" />
      </div>

      {/* Action Buttons - Top Right Corner */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5 sm:gap-2">
        <button
          onClick={() => onEdit(campus)}
          className="
            p-1.5 sm:p-2
            rounded-lg sm:rounded-xl
            bg-black/40 backdrop-blur-sm
            text-yellow-300
            hover:bg-yellow-400/30
            hover:scale-110
            transition-all
            cursor-pointer
            border border-white/10
          "
          title="Edit Campus"
        >
          <Pencil size={14} className="sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={() => onDelete(campus.campus_id)}
          className="
            p-1.5 sm:p-2
            rounded-lg sm:rounded-xl
            bg-black/40 backdrop-blur-sm
            text-red-300
            hover:bg-red-500/30
            hover:scale-110
            transition-all
            cursor-pointer
            border border-white/10
          "
          title="Delete Campus"
        >
          <Trash2 size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col xs:flex-row xs:items-start justify-between gap-3 xs:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div
            className="
              w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
              rounded-xl sm:rounded-2xl
              bg-gradient-to-r
              from-yellow-400
              to-amber-500
              flex items-center justify-center
              shadow-lg shadow-yellow-500/20
              flex-shrink-0
            "
          >
            <span className="text-green-950 font-bold text-sm sm:text-base md:text-lg">
              AB
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight truncate">
              {campus.campus_name}
            </h2>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
              {campus.is_main_campus ? (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-semibold">
                  Main
                </span>
              ) : (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-semibold">
                  Sub
                </span>
              )}

              {Number(campus.has_morning_shift) === 1 && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] sm:text-xs font-semibold">
                  Morning
                </span>
              )}

              {Number(campus.has_evening_shift) === 1 && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] sm:text-xs font-semibold">
                  Evening
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="mt-4 sm:mt-5 md:mt-6 flex items-start gap-2 sm:gap-3 text-green-100">
        <MapPin
          size={16}
          className="mt-0.5 text-yellow-300 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm truncate">{campus.address}</p>
        </div>

        <button
          type="button"
          onClick={() => onOpenLocation(campus.location)}
          className="
            text-yellow-300
            hover:text-yellow-200
            transition-colors
            cursor-pointer
            z-20
            flex-shrink-0
          "
          title="Open Location"
        >
          <ExternalLink size={16} />
        </button>
      </div>

      {/* Phone */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-green-100">
        <Phone size={16} className="text-yellow-300 flex-shrink-0" />
        <span className="text-xs sm:text-sm truncate">{campus.phone_number}</span>
      </div>

      {/* POC */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-green-100">
        <PocketKnife size={16} className="text-yellow-300 flex-shrink-0" />
        <span className="text-xs sm:text-sm truncate">{campus.poc_name}</span>
      </div>

      {/* Description */}
      {campus.detail && (
        <div
          className="
            mt-3 sm:mt-4 md:mt-5
            rounded-xl sm:rounded-2xl
            bg-black/10
            border
            border-white/10
            p-3 sm:p-4
          "
        >
          <p className="text-xs sm:text-sm text-green-100/90 leading-relaxed line-clamp-2">
            {campus.detail}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5 md:mt-6">
        <div
          className="
            rounded-xl sm:rounded-2xl
            bg-gradient-to-br
            from-white/10
            to-white/5
            border
            border-white/10
            p-3 sm:p-4
          "
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-300">
            <Users size={14} className="sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs">Students</span>
          </div>

          <p className="text-white text-2xl sm:text-3xl font-bold mt-1.5 sm:mt-2">
            {campus.students ?? 0}
          </p>
        </div>

        <div
          className="
            rounded-xl sm:rounded-2xl
            bg-gradient-to-br
            from-white/10
            to-white/5
            border
            border-white/10
            p-3 sm:p-4
          "
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-300">
            <GraduationCap size={14} className="sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs">Teachers</span>
          </div>

          <p className="text-white text-2xl sm:text-3xl font-bold mt-1.5 sm:mt-2">
            {campus.teachers ?? 0}
          </p>
        </div>
      </div>

      {/* View Button */}
      <div className="relative z-30 mt-4 sm:mt-5 md:mt-6">
        <button
          type="button"
          onClick={() => onViewDashboard(campus.campus_id)}
          className="
            w-full
            py-2.5 sm:py-3
            rounded-xl sm:rounded-2xl
            bg-gradient-to-r
            from-yellow-400
            to-amber-500
            text-green-950
            font-semibold
            text-sm sm:text-base
            hover:scale-[1.02]
            hover:shadow-lg hover:shadow-yellow-500/20
            transition-all
            duration-300
            cursor-pointer
          "
        >
          View Campus
        </button>
      </div>
    </div>
  );
}