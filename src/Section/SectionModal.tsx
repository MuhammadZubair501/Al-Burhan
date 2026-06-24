import { useEffect, useMemo, useState, useCallback } from "react";
import { X, School, GraduationCap, Section, Search, Building2 } from "lucide-react";
import { classService } from "../services/ClassService";
import ApiRoutes from "../services/ApiRoutes";

type Teacher = {
  id: number;
  name: string;
};

interface Props {
  classId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    secName: string;
    teacher: string;
    room: string;
  }) => void;
}

const teachers: Teacher[] = [
  { id: 1, name: "Muhammad Ahmed" },
  { id: 2, name: "Usman Khan" },
  { id: 3, name: "Abdul Rehman" },
  { id: 4, name: "Ali Raza" },
  { id: 5, name: "Ali Raza" },
  { id: 6, name: "Ali Raza" },
  { id: 7, name: "Ali Raza" },
  { id: 8, name: "Ali Raza" },
  { id: 9, name: "Ali Raza" },
  { id: 10, name: "Muhammad Ahmed" },
  { id: 12, name: "Usman Khan" },
  { id: 13, name: "Abdul Rehman" },
  { id: 14, name: "Ali Raza" },
  { id: 15, name: "Ali Raza" },
  { id: 16, name: "Ali Raza" },
  { id: 17, name: "Ali Raza" },
  { id: 18, name: "Ali Raza" },
  { id: 19, name: "Ali Raza" },
];

export default function ClassModal({
  classId,
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [secName, setSecName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [className, setClassName] = useState("");

  // Memoized filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Handle form submission
const handleSubmit = useCallback(async () => {
  try {
    await fetch(ApiRoutes.SECTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_id: classId,
        section_name: secName,
        teacher_id: teachers.at(0)?.id, // MUST be ID (number)
        room: room,
      }),
    });

    // Reset form
    setSecName("");
    setTeacher("");
    setRoom("");
    setSearch("");
    setOpenDropdown(false);

    onClose();

    // optional refresh callback
    onSave({
      secName,
      teacher,
      room,
    });

  } catch (error) {
    console.error("Error saving section:", error);
  }
}, [secName, teacher, room, classId, onClose, onSave]);
  // Fetch class data
  useEffect(() => {
    if (!isOpen) return;

    const fetchClass = async () => {
      try {
        const classData = await classService.getClass(classId);
        console.log(classData);
        setClassName(classData.class_name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClass();
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(false);
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (openDropdown && !target.closest('.dropdown-container')) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* GLOW EFFECT */}
      <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-yellow-400/10 blur-3xl rounded-full" />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-[95%] sm:max-w-xl
          rounded-[24px] sm:rounded-[32px]
          bg-white/10
          backdrop-blur-2xl
          border border-white/20
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          overflow-visible
          max-h-[90vh] sm:max-h-[95vh]
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
        "
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 sm:top-5 sm:right-5 z-20
            w-8 h-8 sm:w-10 sm:h-10
            rounded-xl
            bg-white/10
            text-white
            hover:bg-red-500/20
            transition-colors
            flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-yellow-400
          "
          aria-label="Close modal"
        >
          <X size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>

        {/* HEADER */}
        <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
            <School size={32} className="sm:w-[40px] sm:h-[40px] text-green-950" />
          </div>

          <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold text-white">
            Create Class Section
          </h2>

          <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">
            Add new academic Class Section details
          </p>
        </div>

        {/* FORM */}
        <div className="px-4 sm:px-8 space-y-4 sm:space-y-5 pb-4 sm:pb-6">
          {/* Class Name - Disabled */}
          <div>
            <label className="text-green-100 text-xs sm:text-sm mb-1.5 sm:mb-2 block font-medium">
              Class Name
            </label>

            <div className="relative">
              <Building2
                size={16}
                className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-yellow-300"
              />

              <input
                disabled
                value={className}
                className="
                  w-full py-2.5 sm:py-4 pl-9 sm:pl-12 pr-3 sm:pr-4
                  rounded-xl sm:rounded-2xl
                  bg-white/5
                  border border-white/10
                  text-white/70
                  cursor-not-allowed
                  text-sm sm:text-base
                  focus:outline-none
                "
                aria-label="Class name"
              />
            </div>
          </div>

          {/* Section Name */}
          <div>
            <label className="text-green-100 text-xs sm:text-sm mb-1.5 sm:mb-2 block font-medium">
              Section Name
            </label>

            <div className="relative">
              <Section
                size={16}
                className="sm:w-[18px] sm:h-[18px] absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-yellow-300"
              />

              <input
                value={secName}
                onChange={(e) => setSecName(e.target.value)}
                placeholder="e.g. SEC A"
                className="
                  w-full py-2.5 sm:py-4 pl-9 sm:pl-12 pr-3 sm:pr-4
                  rounded-xl sm:rounded-2xl
                  bg-white/5
                  border border-white/10
                  text-white
                  placeholder:text-white/50
                  text-sm sm:text-base
                  focus:outline-none focus:ring-2 focus:ring-yellow-400/50
                  transition-all
                "
                aria-label="Section name"
              />
            </div>
          </div>

          {/* Teacher Dropdown */}
          <div className="dropdown-container">
            <label className="text-green-100 text-xs sm:text-sm mb-1.5 sm:mb-2 block font-medium">
              Teacher
            </label>

            <div className="relative">
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="
                  w-full px-3 sm:px-4 py-2.5 sm:py-4
                  rounded-xl sm:rounded-2xl
                  bg-white/10
                  border border-white/20
                  text-white
                  flex justify-between items-center
                  cursor-pointer
                  hover:bg-white/15
                  transition-colors
                  focus:outline-none focus:ring-2 focus:ring-yellow-400/50
                "
                role="combobox"
                aria-expanded={openDropdown}
                aria-haspopup="listbox"
                tabIndex={0}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GraduationCap size={16} className="sm:w-[18px] sm:h-[18px] text-yellow-300 flex-shrink-0" />
                  <span className={teacher ? "text-white truncate" : "text-white/50 truncate"}>
                    {teacher || "Select Teacher"}
                  </span>
                </div>

                <Search size={14} className="sm:w-[16px] sm:h-[16px] text-yellow-300 flex-shrink-0 ml-2" />
              </div>

              {/* Dropdown */}
              {openDropdown && (
                <div
                  className="
                    absolute w-full mt-1.5 sm:mt-2
                    rounded-xl sm:rounded-2xl
                    bg-emerald-950/95
                    backdrop-blur-2xl
                    border border-white/20
                    shadow-2xl
                    overflow-hidden
                    z-[9999]
                  "
                  role="listbox"
                >
                  {/* Search Input */}
                  <div className="p-1.5 sm:p-2 border-b border-white/10">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search teacher..."
                      className="
                        w-full px-2.5 sm:px-3 py-1.5 sm:py-2
                        rounded-lg
                        bg-white/10
                        text-white
                        text-xs sm:text-sm
                        outline-none
                        focus:ring-2 focus:ring-yellow-400
                        placeholder:text-white/50
                      "
                      aria-label="Search teachers"
                      autoFocus
                    />
                  </div>

                  {/* Teacher List */}
                  <div className="max-h-36 sm:max-h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setTeacher(t.name);
                            setOpenDropdown(false);
                            setSearch("");
                          }}
                          className="
                            px-3 sm:px-4 py-1.5 sm:py-2
                            text-white
                            hover:bg-yellow-400/20
                            cursor-pointer
                            text-sm sm:text-base
                            transition-colors
                          "
                          role="option"
                          aria-selected={teacher === t.name}
                        >
                          {t.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 sm:px-4 py-2 text-white/50 text-sm">
                        No teachers found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-8 py-4 sm:py-8 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-white/5">
          <button
            onClick={onClose}
            className="
              w-full sm:w-auto
              px-4 sm:px-6 py-2.5 sm:py-3
              rounded-xl sm:rounded-2xl
              bg-white/10
              text-white
              hover:bg-white/20
              transition-colors
              text-sm sm:text-base
              font-medium
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              w-full sm:w-auto
              px-4 sm:px-8 py-2.5 sm:py-3
              rounded-xl sm:rounded-2xl
              bg-gradient-to-r from-yellow-400 to-amber-500
              text-green-950
              font-bold
              text-sm sm:text-base
              hover:scale-[1.02] sm:hover:scale-105
              transition-all
              disabled:opacity-40
              focus:outline-none focus:ring-2 focus:ring-yellow-400/50
            "
          >
            Save Class
          </button>
        </div>
      </div>
    </div>
  );
}