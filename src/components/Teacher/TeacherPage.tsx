import { GraduationCap, Plus, Loader2, Search, Filter, X } from "lucide-react";
import TeacherAndStudentCard from "./TeacherCard";
import TeacherModal from "./TeacherModal";
import TeacherDetailModal from "./TeacherDetailModal";
import { useState, useEffect } from "react";
import PageHeader from "../PageHeader";
import { teacherService } from "../../services/teacherService";
import Swal from "sweetalert2";
import { BASE_URL } from '../../config/api';

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const toast = document.createElement('div');
  toast.className = `
    fixed top-4 right-4 z-[9999] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-medium
    ${colors[type]} shadow-2xl transform transition-all duration-300
    flex items-center gap-2 sm:gap-3 text-sm sm:text-base
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });
  
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  cnic_number: string;
  emergency_number: string;
  joining_date: string;
  highest_education: string;
  shift: string;
  profile_image_path: string | null;
  extra_details: string | null;
  campus_id: number;
  campus_name?: string;
  department_id: number;
  department_name?: string;
  sections: Array<{ section_id: number; section_name: string; class_name: string }>;
  subjects: Array<{ subject_id: number; subject_name: string }>;
  section_ids?: number[];
  subject_ids?: number[];
}

const Heading = "Teacher Management";
const Description = "Manage all teachers of Al-Burhan Academy";

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || BASE_URL;
  return `${baseUrl}${imagePath}`;
};

// Define the type for the initial data that TeacherModal expects
type TeacherModalInitialData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "" | "male" | "female" | "other";
  cnic: string;
  emergencyNumber: string;
  joiningDate: string;
  department: string;
  assignedClasses: string[];
  subjectsTaught: string[];
  shift: "" | "morning" | "evening";
  campus: string;
  campusId: number;
  highestDegree: string;
  extraDetail: string;
  teacherId: string;
  profilePicture: null;
  profilePreview: string;
};

export default function TeacherPage() {
  const [openTeacherModal, setOpenTeacherModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterShift, setFilterShift] = useState<string>("all");

  const campusId = Number(window.CampusID) || 1;

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teachers, searchTerm, filterDepartment, filterShift]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await teacherService.getTeachers();
      const teacherData = response.data || response;
      const filteredTeachers = teacherData.filter(
        (teacher: Teacher) => teacher.campus_id === campusId
      );
      setTeachers(filteredTeachers);
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
      showToast(error.message || 'Failed to load teachers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...teachers];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(teacher =>
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(term) ||
        teacher.email_address.toLowerCase().includes(term) ||
        teacher.phone_number.includes(term) ||
        (teacher.department_name && teacher.department_name.toLowerCase().includes(term))
      );
    }

    // Department filter
    if (filterDepartment !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.department_name === filterDepartment
      );
    }

    // Shift filter
    if (filterShift !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.shift === filterShift
      );
    }

    setFilteredTeachers(filtered);
  };

  const handleViewDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpenDetailModal(true);
  };

  const handleEdit = (teacher: Teacher) => {
    console.log('✏️ Editing teacher:', teacher);
    setEditingTeacher(teacher);
    setOpenTeacherModal(true);
  };

  const handleDelete = async (teacher: Teacher) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${teacher.first_name} ${teacher.last_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await teacherService.deleteTeacher(teacher.teacher_id);
      await Swal.fire({
        title: "Deleted!",
        text: "Teacher deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchTeachers();
    } catch (error: any) {
      console.error("Error deleting teacher:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete teacher",
        icon: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      await Swal.fire({
        title: "Success!",
        text: editingTeacher ? "Teacher updated successfully" : "Teacher created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchTeachers();
      setOpenTeacherModal(false);
      setEditingTeacher(null);
    } catch (error: any) {
      console.error("Error saving teacher:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to save teacher",
        icon: "error",
      });
    }
  };

  const getInitialData = (): TeacherModalInitialData | undefined => {
    if (!editingTeacher) return undefined;
    
    console.log('📊 Getting initial data from teacher:', editingTeacher);
    
    // Helper to normalize gender - returns specific union type
    const normalizeGender = (gender: string): "" | "male" | "female" | "other" => {
      if (!gender) return '';
      const normalized = gender.toLowerCase().trim();
      if (normalized === 'male') return 'male';
      if (normalized === 'female') return 'female';
      if (normalized === 'other') return 'other';
      return '';
    };
    
    // Helper to normalize shift - returns specific union type
    const normalizeShift = (shift: string): "" | "morning" | "evening" => {
      if (!shift) return '';
      const normalized = shift.toLowerCase().trim();
      if (normalized === 'morning') return 'morning';
      if (normalized === 'evening') return 'evening';
      return '';
    };
    
    const formattedClasses = editingTeacher.sections?.map((s: any) => 
      `${s.class_name} - ${s.section_name}`
    ) || [];
    
    const formattedSubjects = editingTeacher.subjects?.map((s: any) => s.subject_name) || [];
    
    const initialData: TeacherModalInitialData = {
      firstName: editingTeacher.first_name || '',
      lastName: editingTeacher.last_name || '',
      email: editingTeacher.email_address || '',
      phone: editingTeacher.phone_number || '',
      gender: normalizeGender(editingTeacher.gender),
      cnic: editingTeacher.cnic_number || '',
      emergencyNumber: editingTeacher.emergency_number || '',
      joiningDate: editingTeacher.joining_date || '',
      department: editingTeacher.department_name || '',
      assignedClasses: formattedClasses,
      subjectsTaught: formattedSubjects,
      shift: normalizeShift(editingTeacher.shift),
      campus: editingTeacher.campus_name || '',
      campusId: editingTeacher.campus_id || 0,
      highestDegree: editingTeacher.highest_education || '',
      extraDetail: editingTeacher.extra_details || '',
      teacherId: String(editingTeacher.teacher_id) || '',
      profilePicture: null,
      profilePreview: getImageUrl(editingTeacher.profile_image_path) || '',
    };
    
    console.log('📤 Initial data prepared for modal:', initialData);
    return initialData;
  };

  // Get unique departments for filter
  const departments = [...new Set(teachers.map(t => t.department_name).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("all");
    setFilterShift("all");
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] sm:h-screen">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Loader2 className="w-10 sm:w-12 h-10 sm:h-12 animate-spin text-yellow-400" />
          <span className="text-white text-sm sm:text-base">Loading teachers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-x-hidden">
      <PageHeader
        title={Heading}
        description={Description}
        Icon={GraduationCap}
      />
      
      <div className="relative z-10 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pb-4 sm:pb-6 md:pb-8 overflow-x-hidden">
        {/* Search and Filter Bar - Responsive */}
        <div className="mb-4 sm:mb-6 max-w-full">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-0 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200/60" size={18} />
              <input
                type="text"
                placeholder="Search teachers by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-w-0 bg-white/10 text-white rounded-xl pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-green-200/50 text-sm sm:text-base truncate"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
            >
              <Filter size={18} />
              <span className="hidden xs:inline">Filters</span>
              {(filterDepartment !== "all" || filterShift !== "all") && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></span>
              )}
            </button>

            {/* Clear Filters Button */}
            {(searchTerm || filterDepartment !== "all" || filterShift !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 text-sm flex-shrink-0"
              >
                <X size={16} />
                <span className="hidden xs:inline">Clear</span>
              </button>
            )}
          </div>

          {/* Filter Options - Expandable */}
          {showFilters && (
            <div className="mt-3 p-3 sm:p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Department Filter */}
                <div className="min-w-0">
                  <label className="text-green-100 text-xs sm:text-sm font-medium block mb-1.5">
                    Department
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full min-w-0 bg-white/10 text-white rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm truncate"
                  >
                    <option value="all" className="bg-emerald-900">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-emerald-900">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shift Filter */}
                <div className="min-w-0">
                  <label className="text-green-100 text-xs sm:text-sm font-medium block mb-1.5">
                    Shift
                  </label>
                  <select
                    value={filterShift}
                    onChange={(e) => setFilterShift(e.target.value)}
                    className="w-full min-w-0 bg-white/10 text-white rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm truncate"
                  >
                    <option value="all" className="bg-emerald-900">All Shifts</option>
                    <option value="morning" className="bg-emerald-900">Morning</option>
                    <option value="evening" className="bg-emerald-900">Evening</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-3 sm:mb-4">
          <p className="text-green-100/60 text-xs sm:text-sm">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </p>
        </div>

        {/* Teachers Grid - No horizontal scroll */}
        <div className="w-full overflow-x-hidden">
          {filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-white/60">
              <GraduationCap size={48} className="mb-3 sm:mb-4 opacity-30" />
              <p className="text-lg sm:text-xl font-medium text-center">
                {teachers.length === 0 ? "No teachers found" : "No teachers match your filters"}
              </p>
              <p className="text-xs sm:text-sm text-center">
                {teachers.length === 0 
                  ? "Click the + button to add your first teacher"
                  : "Try adjusting your search or filters"
                }
              </p>
              {(searchTerm || filterDepartment !== "all" || filterShift !== "all") && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 transition text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.teacher_id} className="w-full min-w-0">
                  <TeacherAndStudentCard
                    id={teacher.teacher_id}
                    image={getImageUrl(teacher.profile_image_path) || '/avatar.png'}
                    name={`${teacher.first_name} ${teacher.last_name}`}
                    address={teacher.extra_details || 'No address provided'}
                    phone={teacher.phone_number}
                    email={teacher.email_address}
                    department={teacher.department_name || 'Department not assigned'}
                    shift={teacher.shift}
                    joiningDate={teacher.joining_date}
                    onViewDetails={() => handleViewDetails(teacher)}
                    onEdit={() => handleEdit(teacher)}
                    onDelete={() => handleDelete(teacher)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

   {/* Floating Action Button - Responsive */}
        <button
          onClick={() => {
            setEditingTeacher(null);
            setOpenTeacherModal(true);
          }}
          className="
            group
            cursor-pointer
            fixed
            bottom-6 md:bottom-8
            right-6 md:right-8
            h-12 md:h-14
            px-4 md:px-5
            rounded-full
            bg-gradient-to-br
            from-yellow-400
            to-amber-500
            text-green-950
            font-semibold
            text-sm md:text-base
            tracking-wide
            shadow-lg
            shadow-amber-500/20
            flex
            items-center
            gap-2
            hover:-translate-y-1
            hover:shadow-xl
            hover:shadow-amber-500/30
            active:translate-y-0
            active:scale-98
            transition-all
            duration-300
            ease-out
            z-50
          "
        >
          <Plus 
            size={18} 
            className="transition-transform duration-300 group-hover:rotate-90" 
          />
          <span>Add Teacher</span>
        </button>

      </div>

      <TeacherModal
        isOpen={openTeacherModal}
        onClose={() => {
          setOpenTeacherModal(false);
          setEditingTeacher(null);
        }}
        onSave={handleSave}
        initialData={getInitialData()}
        mode={editingTeacher ? 'edit' : 'create'}
      />

      <TeacherDetailModal
        isOpen={openDetailModal}
        onClose={() => {
          setOpenDetailModal(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
        onEdit={() => {
          if (selectedTeacher) {
            setOpenDetailModal(false);
            handleEdit(selectedTeacher);
          }
        }}
        onDelete={() => {
          if (selectedTeacher) {
            setOpenDetailModal(false);
            handleDelete(selectedTeacher);
          }
        }}
      />
    </div>
  );
}