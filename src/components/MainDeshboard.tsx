import { useState } from "react";
import Sidebar, { type TabType } from "./Sidebar";
import DashboardContent from "./DashboardContent";
import TeacherContent from "./Teacher/TeacherContent";
import StudentContent from "./Student/StudentPage";
import LibraryContent from ".//LibraryContent";
import BackgroundRings from ".//BackgroundRings";
<<<<<<< HEAD
import SectionPage from "../Section/SectionPage";
=======
import SectionPage from "./SectionPage";
>>>>>>> 87e4fae1d57893fb48bd547abb54780f8bfd22d5
import AttendancePage from "./AttendancePage";
import ProfileButton from "./ProfileButton";



export default function MianDeshboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [openProfile, setOpenProfile] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "teacher":
        return <TeacherContent />;
      case "student":
        return <StudentContent />;
      case "section":
        return <SectionPage />;
      case "library":
        return <LibraryContent />;
        case "Attendance":
        return <AttendancePage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
   
    <div className="relative flex h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 overflow-hidden">

      <BackgroundRings />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main */}
<div className="flex-1 flex flex-col relative z-10">

  {/* Top Bar (ONLY PROFILE) */}
  <div className="flex justify-end items-center px-8 py-5">
    <ProfileButton />
  </div>

  {/* Page Content */}
  <main className="flex-1 overflow-auto p-6">
    {renderContent()}
  </main>

</div>
    </div>
  );
}