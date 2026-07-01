// MainDeshboard.tsx
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Sidebar, { type TabType } from "./Sidebar";
import TeacherContent from "./Teacher/TeacherContent";
import StudentContent from "./Student/StudentPage";
import LibraryPage from "./LibraryPage";
import BackgroundRings from "./common/BackgroundRings";
import SectionPage from "../Section/SectionPage";
import ConfigurationPage from "../Configuration/ConfigurationPage";
import ClassPage from "../Class/ClassPage";
import TeacherAttendancePage from "../Attendance/TeacherAttendance/TeacherAttendancePage";
import StudentAttendancePage from "../Attendance/StudentAttendance/StudentAttendancePage";
import DashboardPage from "./dashboard/DashboardPage";

export default function MainDeshboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  
  // Check if we're on a section page
  const isSectionPage = location.pathname.includes('/sections/');

  // Set active tab based on route
  useEffect(() => {
    if (isSectionPage) {
      setActiveTab("class");
    }
  }, [isSectionPage]);

  // Handle tab change - if on section page, navigate back to classes
  const handleTabChange = (tab: TabType) => {
    if (isSectionPage) {
      // If on section page and trying to change tab, navigate to MainDeshboard first
      navigate('/MainDeshboard');
      // Small delay to let navigation complete
      setTimeout(() => {
        setActiveTab(tab);
      }, 50);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    // If we're on a section page, show SectionPage
    if (isSectionPage && classId) {
      return <SectionPage classId={classId} />;
    }

    // Otherwise show based on active tab
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

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 overflow-hidden">
      <BackgroundRings />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col relative z-10">
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}