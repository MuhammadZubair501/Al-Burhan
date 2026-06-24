// Class/ClassPage.tsx
import { Plus, SquareDashedText } from "lucide-react";
import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import ClassCard from "./ClassCard";
import ClassModal from "./Model/ClassModal";
import { classService } from "../services/ClassService";
import Swal from "sweetalert2";

// Type matching the database structure
type Class = {
  class_id: number;
  class_name: string;
  department_id: number;
  department_name: string;
  batch_id: number;
  batch_name: string;
  shift: string;
  student_count?: string;
  total_sections?: string;
};

export default function ClassPage() {
  const [openClassModal, setOpenClassModal] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<Class | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  // Fetch classes from API
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    // If no campus is selected, clear the state immediately and skip the API call
    if (!window.CampusID) {
      setClasses([]);
      return;
    }

    setLoading(true);
    try {

      // Fetches filtered records via the relation table pipeline
      console.log('Fetching classes for CampusID:', window.CampusID);
      const data = await classService.getClassesByCampus(window.CampusID);
      
      // Transform data to match the Class type
      const transformedData = data.map((item: any) => ({
        class_id: item.class_id,
        class_name: item.class_name,
        department_id: item.department_id,
        department_name: item.department_name,
        batch_id: item.batch_id,
        batch_name: item.batch_name,
        shift: item.shift,
        student_count: item.student_count || "0",
        total_sections: item.total_sections || "0",
      }));
      setClasses(transformedData);
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('Failed to fetch classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleSave = async (data: {
  className: string;
  department: string;
  batch: string;
  shift: string;
}) => {
  try {
    if (mode === "edit" && editData) {
      await classService.updateClass(editData.class_id, data);

      await Swal.fire({
        title: "Success!",
        text: "Class updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      await classService.createClass(data);

      await Swal.fire({
        title: "Success!",
        text: "Class created successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    await fetchClasses();
    setOpenClassModal(false);
    setEditData(null);
    setMode("create");
  } catch (error) {
    console.error("Error saving class:", error);

    Swal.fire({
      title: "Error!",
      text:
        error instanceof Error
          ? error.message
          : "Failed to save class",
      icon: "error",
    });
  }
};

  const handleEdit = (classItem: Class) => {
    setEditData(classItem);
    setMode('edit');
    setOpenClassModal(true);
  };
const handleDelete = async (classId: number, className: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `You want to delete "${className}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await classService.deleteClass(classId);

    await Swal.fire({
      title: "Deleted!",
      text: "Class deleted successfully.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    await fetchClasses();
  } catch (error) {
    console.error("Error deleting class:", error);

    Swal.fire({
      title: "Error!",
      text:
        error instanceof Error
          ? error.message
          : "Failed to delete class",
      icon: "error",
    });
  }
};
  return (
    <div className="relative h-full overflow-y-auto bg-transparent selection:bg-yellow-400 selection:text-green-950">
      {/* Header */}
      <PageHeader
        title="Class Management"
        description="Manage and monitor all academic active classes"
        Icon={SquareDashedText}
      />

      <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <p>Loading classes...</p>
            </div>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-green-200/60 text-lg">No classes found. Add your first class to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {classes.map((classItem) => (
              <ClassCard 
                key={classItem.class_id} 
                item={classItem}
                onEdit={() => handleEdit(classItem)}
                onDelete={() => handleDelete(classItem.class_id, classItem.class_name)}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setMode('create');
            setEditData(null);
            setOpenClassModal(true);
          }}
          className="
            fixed bottom-8 right-8
            z-50
            flex items-center gap-2.5
            px-7 py-4
            rounded-full
            bg-gradient-to-r from-yellow-400 to-amber-500
            text-green-950 font-extrabold
            tracking-wide
            shadow-xl shadow-amber-500/20
            hover:scale-105
            hover:shadow-amber-500/30
            active:scale-95
            transition-all
            duration-200
            cursor-pointer
          "
        >
          <Plus size={20} className="stroke-[3]" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Class Modal */}
      <ClassModal
        isOpen={openClassModal}
        onClose={() => {
          setOpenClassModal(false);
          setEditData(null);
          setMode('create');
        }}
        onSave={handleSave}
        editData={editData}
        mode={mode}
      />
    </div>
  );
}