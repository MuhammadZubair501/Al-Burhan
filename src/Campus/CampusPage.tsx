import { useNavigate } from "react-router-dom";
import BackgroundRings from "../components/BackgroundRings";
import CampusModal from "./CampusModal";
import { Plus, University } from "lucide-react";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import CampusCard from "./CampusCard";
import Swal from "sweetalert2";
import ApiRoutes from "../services/ApiRoutes";

export default function CampusPage() {
  const navigate = useNavigate();

  const [campuses, setCampuses] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<any>(null);

  // ---------------- FETCH CAMPUSES ----------------
  const fetchCampuses = async () => {
    try {
     const res = await fetch(ApiRoutes.CAMPUS);
      const data = await res.json();
      setCampuses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  // ---------------- VIEW DASHBOARD ----------------
const goToDashboard = (id: number) => {
  console.log("campus id   " + id);
  
  // 1. Set the global variable
  window.CampusID = id;
  
  // 2. Save it so the new dashboard page can read it after navigating
  localStorage.setItem("CampusID", id.toString());
  
  // 3. Move to the new page
  navigate("/MainDeshboard");
};


  // ---------------- OPEN MAP ----------------
  const handleOpenPicker = (url: string) => {
    window.open(url, "_blank");
  };

  // ---------------- EDIT CAMPUS ----------------
  const handleEditCampus = (campus: any) => {
    setSelectedCampus(campus);
    setOpenModal(true);
  };

  // ---------------- DELETE CAMPUS ----------------
const handleDeleteCampus = async (id: number | string) => {
  const campusId = Number(id);

  if (!campusId || isNaN(campusId)) {
    console.error("Invalid campus id:", id);
    return;
  }

  // ✅ SweetAlert Confirm Box
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This campus will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
   const res = await fetch(
  ApiRoutes.campusById(campusId),
  {
    method: "DELETE",
  }
);

    const data = await res.json();

    if (data.success) {
      // ✅ Success Alert
      Swal.fire({
        title: "Deleted!",
        text: "Campus deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchCampuses();
    } else {
      // ❌ Error Alert
      Swal.fire({
        title: "Error!",
        text: "Failed to delete campus.",
        icon: "error",
      });
    }
  } catch (err) {
    console.error(err);

    Swal.fire({
      title: "Error!",
      text: "Something went wrong.",
      icon: "error",
    });
  }
};

  return (
    <div className="relative h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 overflow-hidden overflow-y-auto">
      <BackgroundRings />

      <div className="p-12 relative z-10">
        <PageHeader
          title="Campus Management"
          description="Manage all Al-Burhan Academy branches"
            Icon={University}
        />

        {/* CAMPUS GRID */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {campuses.map((campus) => (
            <CampusCard
              key={campus.campus_id}
              campus={campus}
              onEdit={handleEditCampus}
              onDelete={handleDeleteCampus}
              onOpenLocation={handleOpenPicker}
              onViewDashboard={(id) => goToDashboard(Number(id))}
            />
          ))}
        </div>
      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => {
          setSelectedCampus(null);
          setOpenModal(true);
        }}
        className="
          fixed bottom-8 right-8 z-50
          w-16 h-16 rounded-full
          bg-gradient-to-r from-yellow-400 to-amber-500
          text-green-950 shadow-2xl
          hover:scale-110 active:scale-95
          transition-all duration-300
          flex items-center justify-center
        "
      >
        <Plus size={28} />
      </button>

      {/* CAMPUS MODAL */}
      <CampusModal
        isOpen={openModal}
        campus={selectedCampus}
        onClose={() => {
          setOpenModal(false);
          setSelectedCampus(null);
        }}
        onSave={() => {
          fetchCampuses();
          setOpenModal(false);
          setSelectedCampus(null);
        }}
      />
    </div>
  );
}