import {
  Pencil,
  Trash2,
  Eye,
  MapPin,
  BadgeIcon,
} from "lucide-react";

interface TeacherCardProps {
  id: string | number;
  image: string;
  name: string;
  address: string;
  onViewDetails?: (teacher: { id: string | number; name: string; address: string; image: string }) => void;
  onEdit?: (teacher: { id: string | number; name: string; address: string; image: string }) => void;
  onDelete?: (teacher: { id: string | number; name: string; address: string; image: string }) => void;
  onAdd?: () => void;
}

export default function TeacherAndStudentCard({
  id,
  image,
  name,
  address,
  onViewDetails,
  onEdit,
  onDelete,
}: TeacherCardProps) {
  const teacherData = { id, image, name, address };

  return (
    <div
      key={id}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-yellow-400/40
        hover:shadow-2xl
      "
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition" />

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onEdit?.(teacherData)}
          className="
            p-2
            rounded-xl
            bg-yellow-400/20
            text-yellow-300
            hover:bg-yellow-400/30
          "
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete?.(teacherData)}
          className="
            p-2
            rounded-xl
            bg-red-500/20
            text-red-300
            hover:bg-red-500/30
          "
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center">
        <img
          src={image}
          alt={name}
          className="
            w-28
            h-28
            rounded-full
            border-4
            border-yellow-400
            shadow-xl
            object-cover
          "
        />
      </div>

      {/* Info */}
      <div className="mt-5 text-center">
        <h2 className="text-xl font-bold text-white">
          {name}
        </h2>

        <div className="flex justify-center items-center gap-2 mt-2 text-yellow-300">
          <BadgeIcon size={16} />
          <span>{id}</span>
        </div>

        <div className="flex justify-center items-center gap-2 mt-3 text-green-100">
          <MapPin size={16} />
          <span>{address}</span>
        </div>
      </div>

      {/* Footer */}
      <button
        onClick={() => onViewDetails?.(teacherData)}
        className="
          mt-6
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-yellow-400
          to-amber-500
          text-green-950
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          hover:scale-[1.02]
          transition
          cursor-pointer
        "
      >
        <Eye size={18} />
        View Details
      </button>
    </div>
  );
}
