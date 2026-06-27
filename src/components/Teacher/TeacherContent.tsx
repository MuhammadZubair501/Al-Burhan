import { GraduationCap, Plus, Loader2 } from "lucide-react";
import TeacherAndStudentCard from "./TeacherCard";
import TeacherModal from "./TeacherModal";
import TeacherDetailModal from "./TeacherDetailModal";
import { useState, useEffect } from "react";
import PageHeader from "../PageHeader";
import { teacherService } from "../../services/teacherService";
import Swal from "sweetalert2";
import { BASE_URL }   from '../../config/api';
// Simple toast notification system
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const toast = document.createElement('div');
  toast.className = `
    fixed top-4 right-4 z-[9999] px-6 py-3 rounded-xl text-white font-medium
    ${colors[type]} shadow-2xl transform transition-all duration-300
    flex items-center gap-3
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

// Helper function to get image URL
const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || BASE_URL;
  return `${baseUrl}${imagePath}`;
};

export default function TeacherPage() {
  const [openTeacherModal, setOpenTeacherModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const campusId = Number(window.CampusID) || 1;

  useEffect(() => {
    fetchTeachers();
  }, []);

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
      text: editingTeacher
        ? "Teacher updated successfully"
        : "Teacher created successfully",
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

  // Prepare initial data for edit mode
// Update the getInitialData function to use "Class - Section" format
const getInitialData = () => {
  if (!editingTeacher) return undefined;
  
  console.log('📦 Creating initialData from editingTeacher:', editingTeacher);
  
  // Helper to get valid gender
  const getValidGender = (gender: string): 'male' | 'female' | 'other' | '' => {
    if (gender === 'male' || gender === 'female' || gender === 'other') {
      return gender;
    }
    return '';
  };
  
  // Helper to get valid shift
  const getValidShift = (shift: string): 'morning' | 'evening' | '' => {
    if (shift === 'morning' || shift === 'evening') {
      return shift;
    }
    return '';
  };
  
  // Format assigned classes as "Class Name - Section Name"
  const formattedClasses = editingTeacher.sections?.map((s: any) => 
    `${s.class_name} - ${s.section_name}`
  ) || [];
  
  // Format subjects as subject names
  const formattedSubjects = editingTeacher.subjects?.map((s: any) => s.subject_name) || [];
  
  const data = {
    firstName: editingTeacher.first_name || '',
    lastName: editingTeacher.last_name || '',
    email: editingTeacher.email_address || '',
    phone: editingTeacher.phone_number || '',
    gender: getValidGender(editingTeacher.gender),
    cnic: editingTeacher.cnic_number || '',
    emergencyNumber: editingTeacher.emergency_number || '',
    joiningDate: editingTeacher.joining_date || '',
    department: editingTeacher.department_name || '',
    assignedClasses: formattedClasses,
    subjectsTaught: formattedSubjects,
    shift: getValidShift(editingTeacher.shift),
    campus: editingTeacher.campus_name || '',
    campusId: editingTeacher.campus_id || 0,
    highestDegree: editingTeacher.highest_education || '',
    extraDetail: editingTeacher.extra_details || '',
    teacherId: String(editingTeacher.teacher_id) || '',
    profilePicture: null,
    profilePreview: getImageUrl(editingTeacher.profile_image_path) || '',
  };
  
  console.log('📦 Final initialData:', data);
  return data;
};
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
          <span className="text-white text-lg">Loading teachers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <PageHeader
        title={Heading}
        description={Description}
        Icon={GraduationCap}
      />
      
      <div className="relative z-10 p-8">
        {teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/60">
            <GraduationCap size={64} className="mb-4 opacity-30" />
            <p className="text-xl font-medium">No teachers found</p>
            <p className="text-sm">Click the + button to add your first teacher</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teachers.map((teacher) => (
              <TeacherAndStudentCard
                key={teacher.teacher_id}
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
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setEditingTeacher(null);
            setOpenTeacherModal(true);
          }}
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