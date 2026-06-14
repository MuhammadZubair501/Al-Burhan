import { Plus } from "lucide-react";
import StudentAndStudentCard from "./StudentCard";

import { useState } from "react";
import StudentModel from "./StudentModel";

const avatarUrl = "https://png.pngtree.com/recommend-works/png-clipart/20241021/ourmid/pngtree-students-reciting-the-koran-png-image_14133625.png";
const Students = [
  {
    id: "S-1001",
    name: "Muhammad Ahmed",
    address: "North Nazimabad, Karachi",
    image: avatarUrl,
  },
  {
    id: "S-1002",
    name: "Abdul Rehman",
    address: "Gulshan-e-Iqbal, Karachi",
    image: avatarUrl,
  },
  {
    id: "S-1003",
    name: "Usman Khan",
    address: "DHA Phase 6, Karachi",
    image: avatarUrl,
  },
   {
    id: "S-1004",
    name: "Muhammad Ahmed",
    address: "North Nazimabad, Karachi",
    image: avatarUrl,
  },
  {
    id: "S-1005",
    name: "Abdul Rehman",
    address: "Gulshan-e-Iqbal, Karachi",
    image: avatarUrl,
  },
  {
    id: "S-1006",
    name: "Usman Khan",
    address: "DHA Phase 6, Karachi",
    image: avatarUrl,
  },
   {
    id: "S-1007",
    name: "Muhammad Ahmed",
    address: "North Nazimabad, Karachi",
    image: avatarUrl,
  },
  {
    id: "S-1008",
    name: "Abdul Rehman",
    address: "Gulshan-e-Iqbal, Karachi",
    image: avatarUrl,
  },
  {
    id: "S-1009",
    name: "Usman Khan",
    address: "DHA Phase 6, Karachi",
    image: avatarUrl,
  },
];

const Heading = "Student Management";
const Description = "Manage all Students of Al-Burhan Academy";

export default function StudentPage() {

  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  
  // Optional: Track last admission number for auto-increment
  const [lastAdmissionNumber, setLastAdmissionNumber] = useState(24001);

  const handleSaveStudent = (studentData: any) => {
    console.log('Student saved:', studentData);
    // Here you can:
    // - Send data to your backend API
    // - Update local state
    // - Increment admission number for next student
    setLastAdmissionNumber(prev => prev + 1);
  };




  return (
    <div className="relative h-full overflow-y-auto">
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">{Heading}</h1>
          <p className="text-green-100 mt-2">{Description}</p>
        </div>

        {/* Student Grid using reusable card */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Students.map((Student) => (
            <StudentAndStudentCard
              key={Student.id}
              id={Student.id}
              image={Student.image}
              name={Student.name}
              address={Student.address}
              onViewDetails={(data) =>
                alert(`Viewing details for:\n${data.name}\n${data.id}\n${data.address}`)
              }
              onEdit={(data) => alert(`Edit: ${data.name}`)}
              onDelete={(data) => alert(`Delete: ${data.name}`)}
              onAdd={() => alert("Add New Student Form Coming Soon!")}
            />
          ))}
        </div>

 {/* Student Form Modal */}
      <StudentModel
        isOpen={isStudentFormOpen}
        onClose={() => setIsStudentFormOpen(false)}
        onSave={handleSaveStudent}
        lastAdmissionNumber={lastAdmissionNumber}
      />
        {/* Floating Add Button */}
        <button
          onClick={() =>  setIsStudentFormOpen(true)}


       
    
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
    </div>
  );
}
