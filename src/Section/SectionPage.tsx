import {
  Users,
  GraduationCap,
  School,
  DoorOpen,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import { useState } from "react";
import SectionModal from "./SectionModal";

type Section = {
  id: number;
  name: string;
  teacher: string;
  students: number;
  room: string;
};

const initialSections: Section[] = [
  {
    id: 1,
    name: "SEC A",
    teacher: "Muhammad Ahmed",
    students: 27,
    room: "Room 101",
  },
  {
    id: 2,
    name: "SEC B",
    teacher: "Abdul Rehman",
    students: 25,
    room: "Room 205",
  },
  {
    id: 3,
    name: "SEC C",
    teacher: "Usman Khan",
    students: 28,
    room: "Room 302",
  },
];

export default function SectionPage() {
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [sections, setSections] = useState<Section[]>(initialSections);

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="relative z-10 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Section Management
          </h1>
          <p className="text-green-100 mt-2">
            Manage all academic sections
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="
                group
                bg-white/10
                backdrop-blur-xl
                border
                border-white/20
                rounded-3xl
                p-6
                hover:border-yellow-400/40
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              {/* Top */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                    <School className="text-green-950" />
                  </div>

                  <h2 className="text-xl font-bold text-white">
                    {section.name}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 cursor-pointer rounded-lg bg-white/10 text-yellow-300 hover:bg-yellow-400/20">
                    <Pencil size={16} />
                  </button>

                  <button className="p-2 cursor-pointer rounded-lg bg-white/10 text-red-300 hover:bg-red-500/20">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Teacher */}
              <div className="mt-3 flex items-center gap-3 text-green-100">
                <GraduationCap size={18} className="text-yellow-300" />
                <span>Teacher: {section.teacher}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Users size={16} />
                    <span className="text-sm">Students</span>
                  </div>
                  <p className="text-white text-2xl font-bold mt-2">
                    {section.students}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-yellow-300">
                    <DoorOpen size={16} />
                    <span className="text-sm">Room</span>
                  </div>
                  <p className="text-white text-2xl font-bold mt-2">
                    {section.room}
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
              onClick={ ()=> alert("View Section Coming soon")}
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
                  hover:scale-[1.02]
                  transition
                  cursor-pointer
                "
              >
                View Section
              </button>
            </div>
          ))}
        </div>

        {/* Floating Button */}
        <button
          onClick={() => setOpenSectionModal(true)}
          className="
            fixed bottom-8 right-8
            flex items-center gap-2
            px-6 py-4
            rounded-full
            bg-gradient-to-r from-yellow-400 to-amber-500
            text-green-950 font-bold
            shadow-2xl
            hover:scale-105
            transition
          "
        >
          <Plus size={20} />
          Add Section
        </button>
      </div>

      {/* ✅ MODAL */}
    <SectionModal
  isOpen={openSectionModal}
  onClose={() => setOpenSectionModal(false)}
  onSave={(data) => {
    setSections((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: data.secName,     // ✅ FIXED
        teacher: data.teacher,  // ✅ FIXED (string not object)
        students: 0,
        room: data.room,        // ✅ FIXED
      },
    ]);
  }}
/>
    </div>
  );
}