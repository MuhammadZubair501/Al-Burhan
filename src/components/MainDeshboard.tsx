// MainDeshboard.tsx (Alternative with icon)
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Sidebar, { type TabType } from "./Sidebar";
import ProfileButton from "./ProfileButton";
import TeacherContent from "./Teacher/TeacherPage";
import StudentContent from "./Student/StudentPage";
import LibraryPage from "./LibraryPage";
import BackgroundRings from "./common/BackgroundRings";
import SectionPage from "../Section/SectionPage";
import ConfigurationPage from "../Configuration/ConfigurationPage";
import ClassPage from "../Class/ClassPage";
import TeacherAttendancePage from "../Attendance/TeacherAttendance/TeacherAttendancePage";
import StudentAttendancePage from "../Attendance/StudentAttendance/StudentAttendancePage";
import DashboardPage from "./dashboard/DashboardPage";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  SquareDashedText,
  Cog,
} from "lucide-react";

// Page name and icon mapping
const pageConfig: Record<TabType, { name: string; icon: React.ReactNode }> = {
  dashboard: { 
    name: "Dashboard", 
    icon: <LayoutDashboard size={16} className="text-yellow-400" /> 
  },
  library: { 
    name: "Library", 
    icon: <BookOpen size={16} className="text-yellow-400" /> 
  },
  class: { 
    name: "Classes", 
    icon: <SquareDashedText size={16} className="text-yellow-400" /> 
  },
  teacher: { 
    name: "Teacher", 
    icon: <GraduationCap size={16} className="text-yellow-400" /> 
  },
  student: { 
    name: "Student", 
    icon: <Users size={16} className="text-yellow-400" /> 
  },
  configuration: { 
    name: "Configuration", 
    icon: <Cog size={16} className="text-yellow-400" /> 
  },
  teacherAttendance: { 
    name: "Teacher Attendance", 
    icon: <Users size={16} className="text-yellow-400" /> 
  },
  studentAttendance: { 
    name: "Student Attendance", 
    icon: <Users size={16} className="text-yellow-400" /> 
  },
};

export default function MainDeshboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  
  const isSectionPage = location.pathname.includes('/sections/');

  useEffect(() => {
    if (isSectionPage) {
      setActiveTab("class");
    }
  }, [isSectionPage]);

  const handleTabChange = (tab: TabType) => {
    if (isSectionPage) {
      navigate('/MainDeshboard');
      setTimeout(() => {
        setActiveTab(tab);
        setMobileOpen(false);
      }, 50);
    } else {
      setActiveTab(tab);
      setMobileOpen(false);
    }
  };

  const renderContent = () => {
    if (isSectionPage && classId) {
      return <SectionPage classId={classId} />;
    }

    switch (activeTab) {
      case "teacher":
        return <TeacherContent />;
      case "student":
        return <StudentContent />;
      case "class":
        return <ClassPage />;
      case "library":
        return <LibraryPage />;
      case "teacherAttendance":
        return <TeacherAttendancePage />;
      case "studentAttendance":
        return <StudentAttendancePage />;
      case "configuration":
        return <ConfigurationPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Get current page config for mobile header
  const getCurrentPageConfig = () => {
    if (isSectionPage) {
      return { name: "Sections", icon: <SquareDashedText size={16} className="text-yellow-400" /> };
    }
    return pageConfig[activeTab] || pageConfig.dashboard;
  };

  const currentPage = getCurrentPageConfig();

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 overflow-hidden">
      <BackgroundRings />

      {/* Mobile Top Bar - With Icon and Page Name - z-40 so modals appear on top */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 py-2 bg-white/5 backdrop-blur-xl border-b border-white/10">
        {/* Left: Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300 shadow-lg"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {/* Center: Page Icon + Name */}
        <div className="flex-1 flex items-center justify-center gap-2 px-2">
          {currentPage.icon}
          <h1 className="text-white font-bold text-base truncate">
            {currentPage.name}
          </h1>
        </div>

        {/* Right: Profile Button */}
        <ProfileButton />
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col relative z-10 w-full min-w-0">
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="pt-14 md:pt-0 w-full max-w-full mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}