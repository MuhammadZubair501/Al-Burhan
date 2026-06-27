import { 
  Pencil, 
  Trash2, 
  MapPin, 
  ExternalLink, 
  Phone, 
  PocketKnife, 
  Users, 
  GraduationCap 
} from 'lucide-react'; // Make sure your icon library matches

// Define the data types for your campus object
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

  // ✅ TEMP DEFAULTS (as you requested)
  students?: number;
  teachers?: number;
}
// Define the props the card needs to work
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
        rounded-3xl
        bg-white/[0.08]
        backdrop-blur-xl
        border
        border-white/15
        p-6
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
        transition-all
        duration-300
        hover:-translate-y-3
        hover:border-yellow-400/40
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-gradient-to-r
              from-yellow-400
              to-amber-500
              flex items-center justify-center
              shadow-lg shadow-yellow-500/20
            "
          >
            <span className="text-green-950 font-bold text-lg">AB</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              {campus.campus_name}
            </h2>

            <div className="flex flex-wrap gap-2 mt-2">
              {campus.is_main_campus ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  Main Campus
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                  Sub Campus
                </span>
              )}

              {Number(campus.has_morning_shift) === 1 && (
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold">
                  Morning
                </span>
              )}

              {Number(campus.has_evening_shift) === 1 && (
                console.log("Evening shift enabled          " + campus.has_evening_shift),
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                  Evening
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(campus)}
            className="
              p-2
              rounded-xl
              bg-white/10
              text-yellow-300
              hover:bg-yellow-400/20
              transition-all
              cursor-pointer
            "
            title="Edit Campus"
          >
            <Pencil size={16} />
          </button>

          <button
           onClick={() => onDelete(campus.campus_id)}
            className="
              p-2
              rounded-xl
              bg-white/10
              text-red-300
              hover:bg-red-500/20
              transition-all
              cursor-pointer
            "
            title="Delete Campus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Address */}
      <div className="mt-6 flex items-start gap-3 text-green-100">
        <MapPin
          size={18}
          className="mt-1 text-yellow-300 flex-shrink-0"
        />

        <div className="flex-1">
          <p>{campus.address}</p>
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
          "
          title="Open Location"
        >
          <ExternalLink size={18} />
        </button>
      </div>

      {/* Phone */}
      <div className="mt-4 flex items-center gap-3 text-green-100">
        <Phone size={18} className="text-yellow-300" />
        <span>{campus.phone_number}</span>
      </div>

      {/* POC */}
      <div className="mt-4 flex items-center gap-3 text-green-100">
        <PocketKnife size={18} className="text-yellow-300" />
        <span>{campus.poc_name}</span>
      </div>

      {/* Description */}
      {campus.detail && (
        <div
          className="
            mt-5
            rounded-2xl
            bg-black/10
            border
            border-white/10
            p-4
          "
        >
          <p className="text-sm text-green-100/90 leading-relaxed">
            {campus.detail}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div
          className="
            rounded-2xl
            bg-gradient-to-br
            from-white/10
            to-white/5
            border
            border-white/10
            p-4
          "
        >
          <div className="flex items-center gap-2 text-yellow-300">
            <Users size={16} />
            <span className="text-sm">Students</span>
          </div>

          <p className="text-white text-3xl font-bold mt-2">
            {/* {campus.students} */}
           {campus.students ?? 0}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            bg-gradient-to-br
            from-white/10
            to-white/5
            border
            border-white/10
            p-4
          "
        >
          <div className="flex items-center gap-2 text-yellow-300">
            <GraduationCap size={16} />
            <span className="text-sm">Teachers</span>
          </div>
   {campus.teachers === null ? (
                <p className="text-white text-3xl font-bold mt-2">
            {campus.teachers}
          
          </p>
              ) : (
             <p className="text-white text-3xl font-bold mt-2">
            {/* {campus.teachers} */}
            
             {campus.teachers ?? 0}
          </p>
              )}
         
        </div>
      </div>

      {/* View Button */}
 {/* Footer Button (Fixed click and z-index layers) */}
              <div className="relative z-30 mt-6">
                <button
                  type="button"
                  onClick={() => onViewDashboard(campus.campus_id)}
                  className="
                    w-full
                    py-3
                    rounded-xl
                    bg-gradient-to-r
                    from-yellow-400
                    to-amber-500
                    text-green-950
                    font-semibold
                    hover:scale-[1.02]
                    transition
                    cursor-pointer
                  "
                >
                  View Campus
                </button>
              </div>
    </div>
  );
}
