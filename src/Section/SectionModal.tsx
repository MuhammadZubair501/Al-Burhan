import { useMemo, useState } from "react";
import { X, School, GraduationCap, DoorOpen, Search } from "lucide-react";

type Teacher = {
  id: number;
  name: string;
};

interface Props {
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
];

export default function SectionModal({
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [secName, setSecName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");

  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  if (!isOpen) return null;

  const isValid = secName && teacher && room;

  const handleSubmit = () => {
    if (!isValid) return;

    onSave({
      secName,
      teacher,
      room,
    });

    setSecName("");
    setTeacher("");
    setRoom("");
    setSearch("");
    setOpenDropdown(false);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-400/10 blur-3xl rounded-full" />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-xl
          rounded-[32px]
          bg-white/10
          backdrop-blur-2xl
          border border-white/20
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          overflow-visible
        "
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
            absolute top-5 right-5 z-20
            w-10 h-10
            rounded-xl
            bg-white/10
            text-white
            hover:bg-red-500/20
            flex items-center justify-center
          "
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl">
            <School size={40} className="text-green-950" />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white">
            Create Section
          </h2>

          <p className="text-green-100 mt-2">
            Add new academic section details
          </p>
        </div>

        {/* FORM */}
        <div className="px-8 space-y-5">

          {/* SECTION NAME */}
          <div>
            <label className="text-green-100 text-sm mb-2 block">
              Section Name
            </label>

            <input
              value={secName}
              onChange={(e) => setSecName(e.target.value)}
              placeholder="e.g. SEC A"
              className="
                w-full px-4 py-4
                rounded-2xl
                bg-white/10
                border border-white/20
                text-white
                outline-none
                focus:ring-2 focus:ring-yellow-400
              "
            />
          </div>

          {/* TEACHER DROPDOWN */}
          <div>
            <label className="text-green-100 text-sm mb-2 block">
              Teacher
            </label>

            <div className="relative">

              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="
                  w-full px-4 py-4
                  rounded-2xl
                  bg-white/10
                  border border-white/20
                  text-white
                  flex justify-between items-center
                  cursor-pointer
                  hover:bg-white/15
                "
              >
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-yellow-300" />
                  <span className={teacher ? "text-white" : "text-white/50"}>
                    {teacher || "Select Teacher"}
                  </span>
                </div>

                <Search size={16} className="text-yellow-300" />
              </div>

              {/* DROPDOWN */}
              {openDropdown && (
                <div
  className="
    absolute w-full mt-2
    rounded-2xl
    bg-emerald-950/95
    backdrop-blur-2xl
    border border-white/20
    shadow-2xl
    overflow-hidden
    z-[9999]
  "
>
                  {/* SEARCH */}
                  <div className="p-2 border-b border-white/10">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search teacher..."
                      className="
                        w-full px-3 py-2
                        rounded-lg
                        bg-white/10
                        text-white
                        text-sm
                        outline-none
                        focus:ring-2 focus:ring-yellow-400
                      "
                    />
                  </div>

                  {/* LIST */}
                  <div className="max-h-44 overflow-y-auto">
                    {filteredTeachers.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setTeacher(t.name);
                          setOpenDropdown(false);
                          setSearch("");
                        }}
                        className="
                          px-4 py-2
                          text-white
                          hover:bg-yellow-400/20
                          cursor-pointer
                        "
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ROOM */}
          <div>
            <label className="text-green-100 text-sm mb-2 block">
              Room Number
            </label>

            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 101"
              className="
                w-full px-4 py-4
                rounded-2xl
                bg-white/10
                border border-white/20
                text-white
                outline-none
                focus:ring-2 focus:ring-yellow-400
              "
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              px-6 py-3
              rounded-2xl
              bg-white/10
              text-white
              hover:bg-white/20
            "
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            onClick={handleSubmit}
            className="
              px-8 py-3
              rounded-2xl
              bg-gradient-to-r from-yellow-400 to-amber-500
              text-green-950
              font-bold
              disabled:opacity-40
              hover:scale-105
              transition
            "
          >
            Save Section
          </button>
        </div>
      </div>
    </div>
  );
}