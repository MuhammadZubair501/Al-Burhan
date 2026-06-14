import { Plus } from "lucide-react";
import TeacherAndStudentCard from "./TeacherCard";

import TeacherModal from "./TeacherModal";
import { useState } from "react";

const teachers = [
  {
    id: "T-1001",
    name: "Muhammad Ahmed",
    address: "North Nazimabad, Karachi",
    image: "./avatar.png",
  },
  {
    id: "T-1002",
    name: "Abdul Rehman",
    address: "Gulshan-e-Iqbal, Karachi",
    image: "./avatar.png",
  },
  {
    id: "T-1003",
    name: "Usman Khan",
    address: "DHA Phase 6, Karachi",
    image: "./avatar.png",
  },
   {
    id: "T-1004",
    name: "Muhammad Ahmed",
    address: "North Nazimabad, Karachi",
    image: "./avatar.png",
  },
  {
    id: "T-1005",
    name: "Abdul Rehman",
    address: "Gulshan-e-Iqbal, Karachi",
    image: "./avatar.png",
  },
  {
    id: "T-1006",
    name: "Usman Khan",
    address: "DHA Phase 6, Karachi",
    image: "./avatar.png",
  },
   {
    id: "T-1007",
    name: "Muhammad Ahmed",
    address: "North Nazimabad, Karachi",
    image: "./avatar.png",
  },
  {
    id: "T-1008",
    name: "Abdul Rehman",
    address: "Gulshan-e-Iqbal, Karachi",
    image: "./avatar.png",
  },
  {
    id: "T-1009",
    name: "Usman Khan",
    address: "DHA Phase 6, Karachi",
    image: "./avatar.png",
  },
];

const Heading = "Teacher Management";
const Description = "Manage all teachers of Al-Burhan Academy";

export default function TeacherPage() {

    const [openTeacherModal, setOpenTeacherModal] = useState(false);

  return (
    <div className="relative h-full overflow-y-auto">
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">{Heading}</h1>
          <p className="text-green-100 mt-2">{Description}</p>
        </div>

        {/* Teacher Grid using reusable card */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <TeacherAndStudentCard
              key={teacher.id}
              id={teacher.id}
              image={teacher.image}
              name={teacher.name}
              address={teacher.address}
              onViewDetails={(data) =>
                alert(`Viewing details for:\n${data.name}\n${data.id}\n${data.address}`)
              }
              onEdit={(data) => alert(`Edit: ${data.name}`)}
              onDelete={(data) => alert(`Delete: ${data.name}`)}
              onAdd={() => alert("Add New Teacher Form Coming Soon!")}
            />
          ))}
        </div>

        {/* Floating Add Button */}
        <button

          onClick={() =>setOpenTeacherModal(true)}

          className="
            fixed
            bottom-8
            right-8
            w-16
            h-16
            rounded-full
            bg-gradient-to-r
            from-yellow-400
            to-amber-500
            text-green-950
            shadow-2xl
            flex
            items-center
            justify-center
            hover:scale-110
            transition-all
            duration-300
            z-50
          "
        >
          <Plus size={28} />
        </button>
      </div>

        {/* MODAL OPEN HERE */}
      <TeacherModal
        isOpen={openTeacherModal}
        onClose={() => setOpenTeacherModal(false)}
        onSave={(data) => {
          console.log("Teacher Data:", data);
        }}
      />

    </div>
  );
}
