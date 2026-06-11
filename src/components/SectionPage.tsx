import {
  Users,
  GraduationCap,
  School,
  DoorOpen,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

const sections = [
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
    {
    id: 4,
    name: "SEC D",

    teacher: "Usman Khan",
    students: 28,
    room: "Room 302",
  },
    {
    id: 5,
    name: "SEC E",

    teacher: "Usman Khan",
    students: 28,
    room: "Room 302",
  },
    {
    id: 6,
    name: "SEC F",

    teacher: "Usman Khan",
    students: 26,
    room: "Room 302",
  },
];

export default function SectionPage() {
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

                   {/* Section Name */}
              <h2 className="mt-5 text-xl font-bold text-white">
                {section.name}
              </h2>

                </div>

                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white/10 text-yellow-300 hover:bg-yellow-400/20">
                    <Pencil size={16} />
                  </button>

                  <button className="p-2 rounded-lg bg-white/10 text-red-300 hover:bg-red-500/20">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            

          

              {/* Teacher */}
              <div className="mt-3 flex items-center gap-3 text-green-100">
                <GraduationCap
                  size={18}
                  className="text-yellow-300"
                />
                <span>Section Teacher : {section.teacher}</span>
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

              <button
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
                "
              >
                View Section
              </button>
            </div>
          ))}
        </div>

        {/* Floating Button */}
        <button
          className="
            fixed
            bottom-8
            right-8
            flex
            items-center
            gap-2
            px-5
            py-4
            rounded-full
            bg-gradient-to-r
            from-yellow-400
            to-amber-500
            text-green-950
            font-semibold
            shadow-2xl
            hover:scale-105
            transition
          "
        >
          <Plus size={20} />
          Add Section
        </button>
      </div>
    </div>
  );
}