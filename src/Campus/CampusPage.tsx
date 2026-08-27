import { useNavigate } from "react-router-dom";
import BackgroundRings from "../components/common/BackgroundRings";
import CampusModal from "./CampusModal";
import { Plus, University, Search, X, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import CampusCard from "./CampusCard";
import Swal from "sweetalert2";
import ApiRoutes from "../services/ApiRoutes";
import { studentService } from "../services/studentService";
import { teacherService } from "../services/teacherService";
import ProfileButton from "../components/ProfileButton";
import { useCampus } from "../context/CampusContext";

export default function CampusPage() {
  const navigate = useNavigate();
  const { setSelectedCampus } = useCampus();

  const [campuses, setCampuses] = useState<any[]>([]);
  const [filteredCampuses, setFilteredCampuses] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCampusData, setSelectedCampusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // ---------------- FETCH CAMPUSES ----------------
  const fetchCampuses = async () => {
    setLoading(true);
    try {
      const res = await fetch(ApiRoutes.CAMPUS);
      const data = await res.json();

      const campusesWithCounts = await Promise.all(
        data.map(async (campus: any) => {
          try {
            const [studentRes, teacherRes] = await Promise.all([
              studentService.getStudentCountByCampus(campus.campus_id),
              teacherService.getTeacherCountByCampus(campus.campus_id),
            ]);

            return {
              ...campus,
              students: studentRes.total_students,
              teachers: teacherRes.total_teachers,
            };
          } catch {
            return {
              ...campus,
              students: 0,
              teachers: 0,
            };
          }
        })
      );

      setCampuses(campusesWithCounts);
      setFilteredCampuses(campusesWithCounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  // ---------------- SEARCH AND FILTER ----------------
  useEffect(() => {
    let filtered = [...campuses];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((campus) =>
        campus.campus_name.toLowerCase().includes(term) ||
        campus.address.toLowerCase().includes(term) ||
        campus.poc_name.toLowerCase().includes(term) ||
        campus.phone_number.includes(term)
      );
    }

    if (filterType !== "all") {
      const isMain = filterType === "main";
      filtered = filtered.filter((campus) => 
        campus.is_main_campus === isMain
      );
    }

    setFilteredCampuses(filtered);
  }, [searchTerm, campuses, filterType]);

  // ---------------- CLEAR SEARCH ----------------
  const clearSearch = () => {
    setSearchTerm("");
    setFilterType("all");
    setShowFilters(false);
  };

  // ---------------- VIEW DASHBOARD ----------------
  const goToDashboard = (id: number) => {
    console.log("🎯 Viewing campus with ID:", id);
    
    // Set the campus ID in the context
    setSelectedCampus(id);
    
    // Also set it in localStorage and window for backward compatibility
    window.CampusID = id;
    localStorage.setItem('selectedCampusId', String(id));
    localStorage.setItem('selectedCampusName', 'Campus');
    localStorage.setItem('CampusID', String(id));
    
    console.log("✅ Campus ID set to:", window.CampusID);
    
    // Navigate to dashboard
    navigate("/MainDeshboard");
  };

  // ---------------- OPEN MAP ----------------
  const handleOpenPicker = (url: string) => {
    window.open(url, "_blank");
  };

  // ---------------- EDIT CAMPUS ----------------
  const handleEditCampus = (campus: any) => {
    setSelectedCampusData(campus);
    setOpenModal(true);
  };

  // ---------------- DELETE CAMPUS ----------------
  const handleDeleteCampus = async (id: number | string) => {
    const campusId = Number(id);

    if (!campusId || isNaN(campusId)) {
      console.error("Invalid campus id:", id);
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This campus will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'rounded-2xl p-4 sm:p-6',
        title: 'text-base sm:text-lg',
        htmlContainer: 'text-sm sm:text-base',
        confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
        cancelButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
      }
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(ApiRoutes.campusById(campusId), {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Deleted!",
          text: "Campus deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#f59e0b",
          background: "#14532d",
          color: "#fff",
          customClass: {
            popup: 'rounded-2xl p-4 sm:p-6',
            title: 'text-base sm:text-lg',
            htmlContainer: 'text-sm sm:text-base',
            confirmButton: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
          }
        });
        fetchCampuses();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete campus.",
          icon: "error",
          confirmButtonColor: "#f59e0b",
          background: "#14532d",
          color: "#fff",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#f59e0b",
        background: "#14532d",
        color: "#fff",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 overflow-x-hidden">
      <BackgroundRings />

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-2 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 flex-shrink-0">
            <University size={16} className="text-green-950" />
          </div>
          <span className="text-white font-bold text-sm truncate">
            Campus Management
          </span>
        </div>
        <ProfileButton />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 pt-16 md:pt-4 sm:pt-6 md:pt-8 lg:pt-10 xl:pt-12 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-12">
        <PageHeader
          title="Campus Management"
          description="Manage all Al-Burhan Academy branches"
          Icon={University}
        />

        {/* Search and Filter Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200/60" size={18} />
              <input
                type="text"
                placeholder="Search campuses by name, address, POC, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 text-white rounded-xl pl-10 pr-10 py-2.5 sm:py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-green-200/50 text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-green-200/60 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 text-sm sm:text-base flex-shrink-0"
            >
              <Filter size={18} />
              <span className="hidden xs:inline">Filters</span>
              {filterType !== "all" && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></span>
              )}
            </button>

            {(searchTerm || filterType !== "all") && (
              <button
                onClick={clearSearch}
                className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 text-sm flex-shrink-0"
              >
                <X size={16} />
                <span className="hidden xs:inline">Clear</span>
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-3 p-3 sm:p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <label className="text-green-100 text-xs sm:text-sm font-medium block mb-1.5">
                    Campus Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`
                        cursor-pointer px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${
                          filterType === "all"
                            ? "bg-yellow-400/20 border-yellow-400 text-yellow-300 border"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 border"
                        }
                      `}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType("main")}
                      className={`
                        cursor-pointer px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${
                          filterType === "main"
                            ? "bg-emerald-400/20 border-emerald-400 text-emerald-300 border"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 border"
                        }
                      `}
                    >
                      Main
                    </button>
                    <button
                      onClick={() => setFilterType("sub")}
                      className={`
                        cursor-pointer px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${
                          filterType === "sub"
                            ? "bg-blue-400/20 border-blue-400 text-blue-300 border"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 border"
                        }
                      `}
                    >
                      Sub
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-green-100/60 text-sm">
                    {filteredCampuses.length} {filteredCampuses.length === 1 ? 'campus' : 'campuses'} found
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-green-100/60 text-xs sm:text-sm">
            {filteredCampuses.length} {filteredCampuses.length === 1 ? 'Campus' : 'Campuses'} found
            {searchTerm && ` for "${searchTerm}"`}
            {filterType !== "all" && ` (${filterType === "main" ? "Main" : "Sub"} campuses only)`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-yellow-400 border-t-transparent" />
              <p className="text-white text-sm sm:text-base">Loading campuses...</p>
            </div>
          </div>
        ) : (
          <>
            {filteredCampuses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-white/60">
                <University size={48} className="mb-3 sm:mb-4 opacity-30" />
                <p className="text-lg sm:text-xl font-medium">No campuses found</p>
                <p className="text-xs sm:text-sm text-center max-w-md">
                  {searchTerm || filterType !== "all" ? (
                    <>
                      No campuses match your current filters
                      <button
                        onClick={clearSearch}
                        className="mt-3 mx-auto cursor-pointer block mt-3 text-yellow-400 hover:text-yellow-300 underline"
                      >
                        Clear all filters
                      </button>
                    </>
                  ) : (
                    "Click the + button to add your first campus"
                  )}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
                {filteredCampuses.map((campus) => (
                  <div key={campus.campus_id} className="w-full min-w-0">
                    <CampusCard
                      campus={campus}
                      onEdit={handleEditCampus}
                      onDelete={handleDeleteCampus}
                      onOpenLocation={handleOpenPicker}
                      onViewDashboard={(id) => goToDashboard(Number(id))}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => {
          setSelectedCampusData(null);
          setOpenModal(true);
        }}
        className="
          fixed
          bottom-4 sm:bottom-6 md:bottom-8
          right-4 sm:right-6 md:right-8
          z-50
          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
          rounded-full
          bg-gradient-to-r from-yellow-400 to-amber-500
          text-green-950 shadow-2xl shadow-yellow-500/30
          hover:scale-110 hover:shadow-yellow-500/50
          active:scale-95
          transition-all duration-300
          flex items-center justify-center
        "
      >
        <Plus size={22} className="sm:w-6 sm:h-6" />
      </button>

      {/* CAMPUS MODAL */}
      <CampusModal
        isOpen={openModal}
        campus={selectedCampusData}
        onClose={() => {
          setOpenModal(false);
          setSelectedCampusData(null);
        }}
        onSave={() => {
          fetchCampuses();
          setOpenModal(false);
          setSelectedCampusData(null);
        }}
      />
    </div>
  );
}