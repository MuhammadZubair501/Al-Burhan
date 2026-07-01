// StudentPage.tsx - Updated with SweetAlert2 integration
import { Plus, Users, Loader2 } from "lucide-react";
import Swal from 'sweetalert2'; // <-- ADDED
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastAdmissionNumber, setLastAdmissionNumber] = useState(24001);
  const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);

  const campusId = Number(window.CampusID) || 1;

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleViewDetails = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleEditStudent = (student: StudentResponse) => {
    console.log('Editing student:', student);
    
    // Build the enrollment class display name
    
    // Build the image URL
    
    // Set the editing student with all data
    setEditingStudent(student);
    setIsStudentFormOpen(true);
  };

  // UPDATED: Delete with SweetAlert2 confirmation
  const handleDeleteStudent = async (student: StudentResponse) => {
    // Show confirmation dialog
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

    // Show loading state
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
        // Success toast
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Student ${student.first_name} ${student.last_name} has been deleted successfully.`,
          timer: 3000,
          showConfirmButton: false
        });
        
        // Refresh the list
        await fetchStudents();
        setIsDetailModalOpen(false);
      } else {
        // Error from API
        await Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: response.message || 'Failed to delete student. Please try again.'
        });
      }
    } catch (err: any) {
      console.error('Error deleting student:', err);
      // Unexpected error
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

  // Prepare initial data for edit mode
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-yellow-400 animate-spin" />
          <p className="text-white/70">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500/50">
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchStudents}
            className="mt-4 px-4 py-2 rounded-xl bg-yellow-400 text-emerald-950 font-semibold hover:bg-yellow-300 transition"
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

      <div className="relative z-10 p-8">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/70 text-lg">No students enrolled yet</p>
            <p className="text-white/50 text-sm mt-2">Click the + button to add your first student</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {students.map((student) => {
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

        {/* Student Form Modal */}
        <StudentModel
          isOpen={isStudentFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveStudent}
          lastAdmissionNumber={lastAdmissionNumber}
          initialData={getInitialData()}
          campusId={campusId}
        />

        {/* Student Detail Modal */}
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

        {/* Floating Add Button */}
        <button
          onClick={() => setIsStudentFormOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}