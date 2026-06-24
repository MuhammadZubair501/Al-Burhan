// SectionPage.tsx
import {
  Users,
  GraduationCap,
  School,
  DoorOpen,
  Pencil,
  Trash2,
  Plus,
  SquareDashedText,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import SectionModal from "./SectionModal";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { classService } from "../services/ClassService";

type Section = {
  id: number;
  name: string;
  teacher: string;
  students: number;
  room: string;
};

interface SectionPageProps {
  classId?: string;
}

// Mock data - replace with actual API call
const mockSections: Section[] = [
  {
    id: 1,
    name: "SEC A",
    teacher: "Muhammad Ahmed",
    students: 27,
    room: "Room 101",
  }
];

export default function SectionPage({ classId }: SectionPageProps) {
  const navigate = useNavigate();
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");

  useEffect(() => {
    if (classId) {
      fetchSections();
      fetchClassName();
    }
  }, [classId]);

  const fetchSections = async () => {
    setLoading(true);
    try {
      // In real app: const data = await sectionService.getSectionsByClass(Number(classId));
      // For now, use mock data
      setSections(mockSections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassName = async () => {
    try {
       const classData = await classService.getClass(classId);
      console.log(classData);
      setClassName(classData.class_name);
   
    } catch (error) {
      console.error('Error fetching class name:', error);
    }
  };

  const handleAddSection = (data: { secName: string; teacher: string; room: string }) => {
    setSections((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: data.secName,
        teacher: data.teacher,
        students: 0,
        room: data.room,
      },
    ]);
  };

  const handleBackToClasses = () => {
    // Navigate to MainDeshboard with class tab active
    navigate('/MainDeshboard');
  };

  return (
    <div className="relative h-full overflow-y-auto">
       <PageHeader
          title={`Sections - ${className}`}
          description={`Manage sections for ${className}`}
          Icon={SquareDashedText}
        />
      {/* Back button and Header */}
      <div className="relative z-10 px-8 pt-6">
        <button
          onClick={handleBackToClasses}
          className="
            flex items-center gap-2
            text-white/70 hover:text-yellow-400
            transition-colors mb-4
            cursor-pointer
          "
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Classes</span>
        </button>
        
       
      </div>

      <div className="relative z-10 p-8 pt-2">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <p>Loading sections...</p>
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-green-200/60 text-lg">No sections found for this class. Add your first section!</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="
                  group
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/20
                  rounded-3xl
                  p-6
                  hover:border-yellow-400/40
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
                      <School className="text-green-950" />
                    </div>

                    <h2 className="text-xl font-bold text-white">
                      {section.name}
                    </h2>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 cursor-pointer rounded-lg bg-white/10 text-yellow-300 hover:bg-yellow-400/20">
                      <Pencil size={16} />
                    </button>

                    <button className="p-2 cursor-pointer rounded-lg bg-white/10 text-red-300 hover:bg-red-500/20">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Teacher */}
                <div className="mt-3 flex items-center gap-3 text-green-100">
                  <GraduationCap size={18} className="text-yellow-300" />
                  <span>Teacher: {section.teacher}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Users size={16} />
                      <span className="text-sm">Students</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-2">
                      {section.students}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <DoorOpen size={16} />
                      <span className="text-sm">Room</span>
                    </div>
                    <p className="text-white text-2xl font-bold mt-2">
                      {section.room}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => alert("View Section Coming soon")}
                  className="
                    mt-6
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
                  View Section
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setOpenSectionModal(true)}
          className="
            fixed bottom-8 right-8
            flex items-center gap-2
            px-6 py-4
            rounded-full
            bg-gradient-to-r from-yellow-400 to-amber-500
            text-green-950 font-bold
            shadow-2xl
            hover:scale-105
            transition
          "
        >
          <Plus size={20} />
          Add Section
        </button>
      </div>

      {/* Section Modal */}
      <SectionModal
        classId={Number(classId)}
        isOpen={openSectionModal}
        onClose={() => setOpenSectionModal(false)}
        onSave={handleAddSection}
      />
    </div>
  );
}