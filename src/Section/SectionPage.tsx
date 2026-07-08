// SectionPage.tsx - Fully Responsive
import {
  Users,
  School,
  Pencil,
  Trash2,
  Plus,
  SquareDashedText,
  ArrowLeft,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SectionModal from "./SectionModal";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { classService } from "../services/ClassService";
import ApiRoutes from "../services/ApiRoutes";

type Section = {
  section_id: number;
  section_name: string;
  teacher_id: number | null;
  teacher_name?: string;
  student_count?: number;
  class_id: number;
};

interface SectionPageProps {
  classId?: string;
}

export default function SectionPage({ classId }: SectionPageProps) {
  const navigate = useNavigate();
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    if (classId) {
      fetchSections();
      fetchClassName();
    }
  }, [classId]);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await fetch(ApiRoutes.sectionByClassId(Number(classId)));
      const data = await response.json();
      
      const sectionsWithDetails = await Promise.all(
        data.map(async (section: any) => {
          let teacherName = '';
          let studentCount = 0;
          
          if (section.teacher_id) {
            try {
              const teacherResponse = await fetch(ApiRoutes.teacherById(section.teacher_id));
              const teacherData = await teacherResponse.json();
              if (teacherData.success && teacherData.data) {
                const teacher = teacherData.data;
                teacherName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim();
                if (!teacherName) {
                  teacherName = teacher.name || `Teacher ${section.teacher_id}`;
                }
              }
            } catch (error) {
              console.error(`Error fetching teacher ${section.teacher_id}:`, error);
            }
          }
          
          try {
            const countResponse = await fetch(ApiRoutes.studentCountBySection(section.section_id));
            const countData = await countResponse.json();
            studentCount = countData.total_students || 0;
          } catch (error) {
            console.error(`Error fetching student count for section ${section.section_id}:`, error);
          }
          
          return {
            ...section,
            section_name: section.section_name,
            teacher_name: teacherName || 'Not Assigned',
            student_count: studentCount,
          };
        })
      );
      
      setSections(sectionsWithDetails);
    } catch (error) {
      console.error('Error fetching sections:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to load sections. Please refresh the page.',
        confirmButtonColor: '#f59e0b',
        background: '#1a1a2e',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClassName = async () => {
    try {
      const classData = await classService.getClass(Number(classId));
      setClassName(classData.class_name);
    } catch (error) {
      console.error('Error fetching class name:', error);
    }
  };

  const handleAddSection = async (data: { secName: string; teacher: string }) => {
    try {
      const response = await fetch(ApiRoutes.SECTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_id: Number(classId),
          section_name: data.secName,
          teacher_id: data.teacher ? parseInt(data.teacher) : null,
        }),
      });

      if (response.ok) {
        await fetchSections();
        await Swal.fire({
          icon: 'success',
          title: 'Section Created!',
          text: `Section "${data.secName}" has been created successfully.`,
          confirmButtonColor: '#f59e0b',
          background: '#1a1a2e',
          color: '#fff',
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create section');
      }
    } catch (error: any) {
      console.error('Error adding section:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to create section. Please try again.',
        confirmButtonColor: '#ef4444',
        background: '#1a1a2e',
        color: '#fff',
      });
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setOpenSectionModal(true);
  };

  const handleUpdateSection = async (data: { secName: string; teacher: string }) => {
    if (!editingSection) return;

    try {
      const response = await fetch(ApiRoutes.sectionById(editingSection.section_id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section_name: data.secName,
          teacher_id: data.teacher ? parseInt(data.teacher) : null,
        }),
      });

      if (response.ok) {
        await fetchSections();
        setEditingSection(null);
        await Swal.fire({
          icon: 'success',
          title: 'Section Updated!',
          text: `Section "${data.secName}" has been updated successfully.`,
          confirmButtonColor: '#f59e0b',
          background: '#1a1a2e',
          color: '#fff',
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update section');
      }
    } catch (error: any) {
      console.error('Error updating section:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update section. Please try again.',
        confirmButtonColor: '#ef4444',
        background: '#1a1a2e',
        color: '#fff',
      });
    }
  };

  const handleDeleteSection = (section: Section) => {
    const hasStudents = section.student_count && section.student_count > 0;
    
    Swal.fire({
      title: 'Delete Section',
      html: `
        <div class="text-left">
          <p class="text-white/70 mb-3">Are you sure you want to delete <strong class="text-white">"${section.section_name}"</strong>?</p>
          ${hasStudents ? `
            <div class="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 mt-3">
              <p class="text-yellow-300 text-sm flex items-center gap-2">
                <span>⚠️</span>
                This section has <strong>${section.student_count}</strong> student(s) enrolled.
              </p>
            </div>
          ` : ''}
          <p class="text-red-400/70 text-sm mt-3">This action cannot be undone!</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete Section',
      cancelButtonText: 'Cancel',
      background: '#1a1a2e',
      color: '#fff',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(ApiRoutes.sectionById(section.section_id), {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete section');
          }

          return true;
        } catch (error: any) {
          Swal.showValidationMessage(error.message || 'Failed to delete section');
          throw error;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        fetchSections();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Section "${section.section_name}" has been deleted successfully.`,
          confirmButtonColor: '#f59e0b',
          background: '#1a1a2e',
          color: '#fff',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleBackToClasses = () => {
    navigate('/MainDeshboard');
  };

  const getInitials = (name: string) => {
    if (!name || name === 'Not Assigned') return 'NA';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (id: number) => {
    const colors = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-amber-500',
      'from-violet-500 to-purple-500',
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="relative h-full overflow-y-auto">
      <PageHeader
        title={`Sections - ${className}`}
        description={`Manage sections for ${className}`}
        Icon={SquareDashedText}
      />
      
      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 pt-2 sm:pt-4">
        <button
          onClick={handleBackToClasses}
          className="
            flex items-center gap-1.5 sm:gap-2
            text-white/70 hover:text-yellow-400
            transition-colors mb-3 sm:mb-4
            cursor-pointer
            group
            text-sm sm:text-base
          "
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Classes</span>
        </button>
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 pt-1 sm:pt-2">
        {loading ? (
          <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-green-200/60">Loading sections...</p>
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 text-center rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-yellow-400/10 flex items-center justify-center mb-3 sm:mb-4">
              <School className="text-yellow-400" size={32} />
            </div>
            <p className="text-green-200/60 text-base sm:text-lg mb-3 sm:mb-4">No sections found for this class</p>
            <button
              onClick={() => setOpenSectionModal(true)}
              className="
                px-4 sm:px-6 py-2.5 sm:py-3
                rounded-xl
                bg-gradient-to-r from-yellow-400 to-amber-500
                text-green-950 font-bold
                hover:scale-105
                transition
                flex items-center gap-2
                text-sm sm:text-base
              "
            >
              <Plus size={18} />
              Add Your First Section
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <div
                key={section.section_id}
                className="
                  group
                  bg-gradient-to-br from-white/10 to-white/5
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-2xl sm:rounded-3xl
                  p-4 sm:p-6
                  hover:border-yellow-400/40
                  hover:-translate-y-2
                  hover:shadow-2xl
                  hover:shadow-yellow-400/5
                  transition-all
                  duration-300
                  relative
                  overflow-hidden
                "
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-all duration-500"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl group-hover:bg-amber-400/10 transition-all duration-500"></div>

                <div className="flex justify-between items-start relative">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`
                      w-12 sm:w-14 h-12 sm:h-14 rounded-2xl 
                      bg-gradient-to-r ${getRandomColor(section.section_id)}
                      flex items-center justify-center
                      shadow-lg
                      group-hover:scale-110
                      transition-transform duration-300
                    `}>
                      <School className="text-white" size={20} />
                    </div>

                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {section.section_name}
                      </h2>
                      <p className="text-green-200/50 text-xs sm:text-sm">Section</p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleEditSection(section)}
                      className="
                        p-1.5 sm:p-2 cursor-pointer rounded-xl 
                        bg-white/5 text-yellow-300 
                        hover:bg-yellow-400/20
                        hover:scale-110
                        transition-all
                        border border-white/10
                      "
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section)}
                      className="
                        p-1.5 sm:p-2 cursor-pointer rounded-xl 
                        bg-white/5 text-red-300 
                        hover:bg-red-500/20
                        hover:scale-110
                        transition-all
                        border border-white/10
                      "
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-green-100 relative">
                  <div className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    section.teacher_name && section.teacher_name !== 'Not Assigned'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950'
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {getInitials(section.teacher_name || '')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-green-200/50">Class Teacher</p>
                    <p className="text-white font-medium truncate text-sm sm:text-base">
                      {section.teacher_name || 'Not Assigned'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:gap-3 mt-4 sm:mt-6 relative">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 hover:bg-white/10 transition-all group/stat">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-300 mb-0.5 sm:mb-1">
                      <Users size={14} className="group-hover/stat:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Total Students</span>
                    </div>
                    <p className="text-white text-2xl sm:text-3xl font-bold">
                      {section.student_count || 0}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    Swal.fire({
                      icon: 'info',
                      title: 'Coming Soon!',
                      text: 'Student list view is under development.',
                      confirmButtonColor: '#f59e0b',
                      background: '#1a1a2e',
                      color: '#fff',
                    });
                  }}
                  className="
                    mt-4 sm:mt-6
                    w-full
                    py-2.5 sm:py-3
                    rounded-xl
                    bg-gradient-to-r
                    from-yellow-400
                    to-amber-500
                    text-green-950
                    font-semibold
                    hover:scale-[1.02]
                    transition
                    cursor-pointer
                    relative
                    overflow-hidden
                    group/btn
                    text-sm sm:text-base
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <UserCircle size={16} />
                    View Students
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setEditingSection(null);
            setOpenSectionModal(true);
          }}
          className="
            fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8
            flex items-center gap-1.5 sm:gap-2
            px-4 sm:px-6
            py-3 sm:py-4
            rounded-full
            bg-gradient-to-r from-yellow-400 to-amber-500
            text-green-950 font-bold
            shadow-2xl
            hover:scale-105
            transition
            group
            z-50
            text-sm sm:text-base
          "
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden xs:inline">Add Section</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      <SectionModal
        classId={Number(classId)}
        isOpen={openSectionModal}
        onClose={() => {
          setOpenSectionModal(false);
          setEditingSection(null);
        }}
        onSave={editingSection ? handleUpdateSection : handleAddSection}
        editData={editingSection ? {
          secName: editingSection.section_name,
          teacher: editingSection.teacher_id?.toString() || '',
          teacherName: editingSection.teacher_name || '',
        } : undefined}
      />
    </div>
  );
}