import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Sidebar, { type TabType } from "./Sidebar";
import ProfileButton from "./ProfileButton";
import TeacherContent from "./Teacher/TeacherPage";
import StudentContent from "./Student/StudentPage";
import StudentDashboard from "./dashboard/StudentDashboard";
import LibraryPage from "./LibraryPage";
import BackgroundRings from "./common/BackgroundRings";
import SectionPage from "../Section/SectionPage";
import ConfigurationPage from "../Configuration/ConfigurationPage";
import ClassPage from "../Class/ClassPage";
import TeacherAttendancePage from "../Attendance/TeacherAttendance/TeacherAttendancePage";
import StudentAttendancePage from "../Attendance/StudentAttendance/StudentAttendancePage";
import DashboardPage from "./dashboard/DashboardPage";
import ProgressPopup from "../components/Mega/ProgressPopup";
import { useCampus } from "../context/CampusContext";
import { authService } from "../services/authService";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  SquareDashedText,
  Cog,
} from "lucide-react";

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
    name: "Students", 
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [progressJobs, setProgressJobs] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const { campusId, isLoading, refreshCampusData } = useCampus();
  
  const isSectionPage = location.pathname.includes('/sections/');

  // Get user role
  useEffect(() => {
    const role = authService.getUserRole();
    setUserRole(role);
    console.log('👤 User Role in MainDeshboard:', role);
  }, []);

  // Force refresh campus data on component mount
  useEffect(() => {
    refreshCampusData();
  }, []);

  // Set window.CampusID when campusId changes
  useEffect(() => {
    if (campusId !== null) {
      console.log('📝 MainDeshboard setting CampusID to:', campusId);
      (window as any).CampusID = campusId;
    }
  }, [campusId]);

  // Force set campus ID from user data as fallback
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('📚 MainDeshboard - User from localStorage:', user);
        
        if (user.campusId && !campusId) {
          console.log('📚 Setting campus ID from user object:', user.campusId);
          window.CampusID = user.campusId;
          localStorage.setItem('CampusID', String(user.campusId));
          localStorage.setItem('userCampusId', String(user.campusId));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [campusId]);

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

  const handleProgressComplete = (jobId: string) => {
    setProgressJobs(prev => prev.filter(id => id !== jobId));
  };

  // ============================================
  // RENDER CONTENT BASED ON ROLE AND TAB
  // ============================================
  const renderContent = () => {
    if (isSectionPage && classId) {
      return <SectionPage classId={classId} />;
    }

    // For student role: Show StudentDashboard when Dashboard tab is clicked
    if (userRole === 'student') {
      // If active tab is dashboard, show StudentDashboard
      if (activeTab === 'dashboard') {
        return <StudentDashboard />;
      }
      // For other tabs (like library), show the respective content
      switch (activeTab) {
        case "library":
          return <LibraryPage />;
        default:
          return <StudentDashboard />;
      }
    }

    // For other roles (admin, teacher, naqeeb)
    switch (activeTab) {
      case "teacher":
        return <TeacherContent />;
      case "student":
        return <StudentContent />; // Student management page for admin
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

  const getCurrentPageConfig = () => {
    if (isSectionPage) {
      return { name: "Sections", icon: <SquareDashedText size={16} className="text-yellow-400" /> };
    }
    
    return pageConfig[activeTab] || pageConfig.dashboard;
  };

  const currentPage = getCurrentPageConfig();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 overflow-hidden">
      <BackgroundRings />

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 py-2 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300 shadow-lg"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 px-2">
          {currentPage.icon}
          <h1 className="text-white font-bold text-base truncate">
            {currentPage.name}
          </h1>
        </div>

        <ProfileButton />
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col relative z-10 w-full min-w-0">
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="pt-14 md:pt-0 w-full max-w-full mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Progress Popups - Filter out invalid jobIds */}
      {progressJobs
        .filter((jobId) => jobId && jobId !== 'undefined' && jobId !== 'null' && jobId !== '')
        .map((jobId) => (
          <ProgressPopup
            key={jobId}
            jobId={jobId}
            onClose={() => setProgressJobs(prev => prev.filter(id => id !== jobId))}
            onComplete={handleProgressComplete}
            autoDownload={true}
          />
        ))}
    </div>
  );
}