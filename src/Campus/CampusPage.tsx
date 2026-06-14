import { useNavigate } from "react-router-dom";
import ProfileButton from "../components/ProfileButton";
import BackgroundRings from "../components/BackgroundRings";
import CampusModal from "./CampusModal";
import {
  MapPin,
  Phone,
  Users,
  GraduationCap,
  Pencil,
  Trash2,
  Plus
} from "lucide-react";
import { useState } from "react";

const campuses = [
  {
    id: 1,
    name: "Al-Burhan Academy - North Nazimabad",
    address: "Block H, North Nazimabad, Karachi",
    phone: "+92 300 1234567",
    students: 850,
    teachers: 45,
  },
  {
    id: 2,
    name: "Al-Burhan Academy - Gulshan Campus",
    address: "Gulshan-e-Iqbal, Karachi",
    phone: "+92 321 9876543",
    students: 620,
    teachers: 32,
  },
];

export default function CampusPage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const goToDashboard = (id: number) => {
    // This will pop up a window on your screen to prove the click works
    // alert("Button Clicked! Campus ID is: " + id);
    
    // This will take you to the dashboard page
    navigate("/MainDeshboard");
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 overflow-hidden overflow-y-auto">
      <BackgroundRings />
  <div className="p-12 relative z-10">

  {/* Top Header Row */}
  <div className="flex items-start justify-between mb-8">

    <div>
      <h1 className="text-4xl font-bold text-white">
        Campus Management
      </h1>

      <p className="text-green-100 mt-2">
        Manage all Al-Burhan Academy branches
      </p>
    </div>

    <ProfileButton />

  </div>

        {/* Campus Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {campuses.map((campus) => (
            <div
              key={campus.id}
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
                hover:border-yellow-400/50
                hover:shadow-2xl
              "
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
              </div>

              {/* Logo + Badge */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <span className="text-green-950 font-bold text-xl">
                      AB
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 relative z-20">
                  <button
                    className="cursor-pointer p-2 rounded-lg bg-white/10 hover:bg-yellow-400/20 text-yellow-300 transition"
                    title="Edit Campus"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="cursor-pointer p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-red-300 transition"
                    title="Delete Campus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Campus Name */}
              <h2 className="mt-5 text-xl font-bold text-white leading-tight">
                {campus.name}
              </h2>

              {/* Address */}
              <div className="mt-5 flex items-start gap-3 text-green-100">
                <MapPin size={18} className="mt-1 text-yellow-300" />
                <span>{campus.address}</span>
              </div>

              {/* Phone */}
              <div className="mt-3 flex items-center gap-3 text-green-100">
                <Phone size={18} className="text-yellow-300" />
                <span>{campus.phone}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Users size={16} />
                    <span className="text-sm">Students</span>
                  </div>
                  <p className="text-white text-2xl font-bold mt-2">
                    {campus.students}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-yellow-300">
                    <GraduationCap size={16} />
                    <span className="text-sm">Teachers</span>
                  </div>
                  <p className="text-white text-2xl font-bold mt-2">
                    {campus.teachers}
                  </p>
                </div>
              </div>

              {/* Footer Button (Fixed click and z-index layers) */}
              <div className="relative z-30 mt-6">
                <button
                  type="button"
                  onClick={() => goToDashboard(campus.id)}
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
          ))}
        </div>
      </div>

{/* Floating Add Campus Button */}
<button
  onClick={() => setOpenModal(true)}
  className="
    fixed
    bottom-8
    right-8
    z-50
    w-16
    h-16
    rounded-full
    bg-gradient-to-r
    from-yellow-400
    to-amber-500
    text-green-950
    shadow-2xl
    hover:scale-110
    active:scale-95
    transition-all
    duration-300
    flex
    items-center
    justify-center
    cursor-pointer
  "
  title="Add Campus"
>
  <Plus size={28} />
</button>

<CampusModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  onSave={(data) => {
    console.log("Campus Data:", data);
    setOpenModal(false);
  }}
/>
    </div>
  );
}
