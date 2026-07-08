// StudentPage.tsx - Fully Responsive with Search & Filters
import { Plus, Users, Loader2, Search, Filter, X } from "lucide-react";
import Swal from 'sweetalert2';
import StudentAndStudentCard from "./StudentCard";
import StudentDetailModal from "./StudentDetailModal";
import StudentModel from "./StudentModel";
import PageHeader from "../PageHeader";
import { studentService, type StudentResponse } from "../../services/studentService";
import { useState, useEffect } from "react";
import { BASE_URL } from '../../config/api';

const Heading = "Student Management";
const Description = "Manage all Students of Al-Burhan Academy";

export default function StudentPage() {
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastAdmissionNumber, setLastAdmissionNumber] = useState(24001);
  const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterShift, setFilterShift] = useState<string>("all");

  const campusId = Number(window.CampusID) || 1;

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, searchTerm, filterGender, filterClass, filterShift]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentService.getStudentsByCampus(campusId);
      if (response.success) {
        setStudents(response.data);
        if (response.data.length > 0) {
          const maxRoll = Math.max(
            ...response.data.map(s => parseInt(s.roll_number || '0') || 0)
          );
          if (maxRoll > 0) {
            setLastAdmissionNumber(maxRoll + 1);
          }
        }
      } else {
        setError('Failed to load students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('An error occurred while loading students');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(term) ||
        student.email_address?.toLowerCase().includes(term) ||
        student.phone_number?.includes(term) ||
        student.roll_number?.toLowerCase().includes(term) ||
        student.class_name?.toLowerCase().includes(term)
      );
    }

    // Gender filter
    if (filterGender !== "all") {
      filtered = filtered.filter(student => 
        student.gender === filterGender
      );
    }

    // Class filter
    if (filterClass !== "all") {
      filtered = filtered.filter(student => 
        student.class_name === filterClass
      );
    }

    // Shift filter
    if (filterShift !== "all") {
      filtered = filtered.filter(student => 
        student.shift === filterShift
      );
    }

    setFilteredStudents(filtered);
  };

  const handleViewDetails = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleEditStudent = (student: StudentResponse) => {
    console.log('Editing student:', student);
    setEditingStudent(student);
    setIsStudentFormOpen(true);
  };

  const handleDeleteStudent = async (student: StudentResponse) => {
    const result = await Swal.fire({
      title: 'Delete Student?',
      html: `Are you sure you want to delete <strong>${student.first_name} ${student.last_name}</strong>?<br/><span style="color: #ef4444; font-size: 0.9rem;">This action cannot be undone!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: 'Deleting...',
      text: 'Please wait',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await studentService.deleteStudent(student.student_id);
      
      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Student ${student.first_name} ${student.last_name} has been deleted successfully.`,
          timer: 3000,
          showConfirmButton: false
        });
        await fetchStudents();
        setIsDetailModalOpen(false);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: response.message || 'Failed to delete student. Please try again.'
        });
      }
    } catch (err: any) {
      console.error('Error deleting student:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An unexpected error occurred while deleting the student.'
      });
    }
  };

  const handleSaveStudent = async () => {
    await fetchStudents();
    if (!editingStudent) {
      setLastAdmissionNumber(prev => prev + 1);
    }
    setEditingStudent(null);
  };

  const handleCloseForm = () => {
    setIsStudentFormOpen(false);
    setEditingStudent(null);
  };

  const transformStudentForCard = (student: StudentResponse) => {
    const fullName = `${student.first_name} ${student.last_name}`;
    const baseUrl = import.meta.env.VITE_API_URL || BASE_URL;
    const imageUrl = student.profile_image_path 
      ? `${baseUrl}${student.profile_image_path}` 
      : '/avatar.png';

    return {
      id: student.roll_number || `STU-${student.student_id}`,
      name: fullName,
      address: student.campus_name || `Campus ${student.campus_id}`,
      image: imageUrl,
      rawData: student
    };
  };

  const getInitialData = () => {
    if (!editingStudent) return undefined;
    
    const baseUrl = import.meta.env.VITE_API_URL || BASE_URL;
    const enrollmentClass = editingStudent.class_name ? 
      `${editingStudent.class_name}${editingStudent.section_name ? ` - ${editingStudent.section_name}` : ''}` : '';
    
    return {
      studentId: editingStudent.student_id,
      firstName: editingStudent.first_name,
      lastName: editingStudent.last_name,
      dateOfBirth: editingStudent.date_of_birth,
      gender: editingStudent.gender as any,
      cnic: editingStudent.cnic,
      phone: editingStudent.phone_number,
      email: editingStudent.email_address,
      emergencyContact: editingStudent.emergency_contact_number,
      admissionNumber: editingStudent.roll_number || '',
      enrollmentClass: enrollmentClass,
      className: editingStudent.class_name || '',
      sectionName: editingStudent.section_name || '',
      classId: editingStudent.class_id || undefined,
      sectionId: editingStudent.section_id || undefined,
      batch: editingStudent.batch_name || '',
      batchName: editingStudent.batch_name || '',
      batchId: editingStudent.batch_id || undefined,
      highestQualification: editingStudent.last_previous_highest_qualification || '',
      shift: editingStudent.shift as any,
      joiningDate: editingStudent.joining_date,
      extraDetails: editingStudent.extra_details || '',
      studentPreview: editingStudent.profile_image_path ? 
        `${baseUrl}${editingStudent.profile_image_path}` : '',
      studentPicture: null
    };
  };

  // Get unique classes for filter
  const classes = [...new Set(students.map(s => s.class_name).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm("");
    setFilterGender("all");
    setFilterClass("all");
    setFilterShift("all");
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Loader2 size={36} className="text-yellow-400 animate-spin" />
          <p className="text-white/70 text-sm sm:text-base">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-500/20 p-4 sm:p-6 rounded-2xl border border-red-500/50 max-w-md w-full">
          <p className="text-red-300 text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchStudents}
            className="mt-4 px-4 py-2 rounded-xl bg-yellow-400 text-emerald-950 font-semibold hover:bg-yellow-300 transition text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <PageHeader title={Heading} description={Description} Icon={Users} />

      <div className="relative z-10 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8">
        {/* Search and Filter Bar - Responsive */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200/60" size={18} />
              <input
                type="text"
                placeholder="Search students by name, roll number, class, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 sm:py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-green-200/50 text-sm sm:text-base"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
            >
              <Filter size={18} />
              <span>Filters</span>
              {(filterGender !== "all" || filterClass !== "all" || filterShift !== "all") && (
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              )}
            </button>

            {/* Clear Filters Button */}
            {(searchTerm || filterGender !== "all" || filterClass !== "all" || filterShift !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 sm:py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 text-sm"
              >
                <X size={16} />
                <span className="hidden xs:inline">Clear</span>
              </button>
            )}
          </div>

          {/* Filter Options - Expandable */}
          {showFilters && (
            <div className="mt-3 p-3 sm:p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Gender Filter */}
              <div>
                <label className="text-green-100 text-xs sm:text-sm font-medium block mb-1.5">
                  Gender
                </label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                >
                  <option value="all" className="bg-emerald-900">All Genders</option>
                  <option value="male" className="bg-emerald-900">Male</option>
                  <option value="female" className="bg-emerald-900">Female</option>
                </select>
              </div>

              {/* Class Filter */}
              <div>
                <label className="text-green-100 text-xs sm:text-sm font-medium block mb-1.5">
                  Class
                </label>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                >
                  <option value="all" className="bg-emerald-900">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls} className="bg-emerald-900">
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Filter */}
              <div>
                <label className="text-green-100 text-xs sm:text-sm font-medium block mb-1.5">
                  Shift
                </label>
                <select
                  value={filterShift}
                  onChange={(e) => setFilterShift(e.target.value)}
                  className="w-full bg-white/10 text-white rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                >
                  <option value="all" className="bg-emerald-900">All Shifts</option>
                  <option value="morning" className="bg-emerald-900">Morning</option>
                  <option value="evening" className="bg-emerald-900">Evening</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-3 sm:mb-4">
          <p className="text-green-100/60 text-xs sm:text-sm">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-white/60">
            <Users size={48} className="mb-3 sm:mb-4 opacity-30" />
            <p className="text-lg sm:text-xl font-medium">
              {students.length === 0 ? "No students enrolled yet" : "No students match your filters"}
            </p>
            <p className="text-xs sm:text-sm">
              {students.length === 0 
                ? "Click the + button to add your first student"
                : "Try adjusting your search or filters"
              }
            </p>
            {(searchTerm || filterGender !== "all" || filterClass !== "all" || filterShift !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 transition text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredStudents.map((student) => {
              const cardData = transformStudentForCard(student);
              return (
                <StudentAndStudentCard
                  key={student.student_id}
                  id={cardData.id}
                  image={cardData.image}
                  name={cardData.name}
                  address={cardData.address}
                  rawData={student}
                  onViewDetails={() => handleViewDetails(student)}
                  onEdit={() => handleEditStudent(student)}
                  onDelete={() => handleDeleteStudent(student)}
                />
              );
            })}
          </div>
        )}

        <StudentModel
          isOpen={isStudentFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveStudent}
          lastAdmissionNumber={lastAdmissionNumber}
          initialData={getInitialData()}
          campusId={campusId}
        />

        <StudentDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          onEdit={() => {
            if (selectedStudent) {
              handleEditStudent(selectedStudent);
              setIsDetailModalOpen(false);
            }
          }}
          onDelete={() => {
            if (selectedStudent) {
              handleDeleteStudent(selectedStudent);
            }
          }}
        />

        {/* Floating Action Button - Responsive */}
        <button
          onClick={() => setIsStudentFormOpen(true)}
          className="
            fixed
            bottom-4 sm:bottom-6 md:bottom-8
            right-4 sm:right-6 md:right-8
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
            rounded-full
            bg-gradient-to-r
            from-yellow-400
            to-amber-500
            text-green-950
            shadow-2xl
            shadow-yellow-500/30
            flex
            items-center
            justify-center
            hover:scale-110
            hover:shadow-yellow-500/50
            active:scale-95
            transition-all
            duration-300
            z-50
          "
        >
          <Plus size={22} className="sm:size-24" />
        </button>
      </div>
    </div>
  );
}