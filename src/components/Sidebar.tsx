import { useState } from "react";

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  SquareDashedText,


} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type TabType = "dashboard" | "section" | "teacher" | "student" | "library" | "Attendance";


type Props = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const menus = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Attendance", label: "Attendance", icon: Users },
    { id: "library", label: "Library", icon: BookOpen },
    { id: "section", label: "Sections", icon: SquareDashedText },
    { id: "teacher", label: "Teacher", icon: GraduationCap },
    { id: "student", label: "Student", icon: Users },
  ];
  const navigate = useNavigate();

  const goToCampusPage = () => {
    // This will pop up a window on your screen to prove the click works
    // alert("Logout Button Clicked! Navigating to Login Page...");
    
    // This will take you to the dashboard page
    navigate("/Campus");
  };
  return (
    <div
      className={`flex flex-col justify-between bg-white/10 backdrop-blur-xl border-r border-white/20 transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div>
      {/* TOP */}
 <button 
  className="w-full p-3 flex items-center gap-3 border-b border-white/30 hover:bg-white/10 transition-colors text-left cursor-pointer"
  onClick={() => goToCampusPage()}
>

  {/* Simple Professional Logo */}
  <div className="w-18 h-18">
    <img src="./logo5.png" alt="Logo" className="h-full" />
    {/* <TreePalm size={28} className="text-green-800" /> */}
  </div>

  {/* Title */}
  {!collapsed && (
    <h1 className="text-3xl font-bold text-white">
      Al-Burhan
    </h1>
  )}

</button>


        {/* MENU */}
        <div className="px-3 space-y-2 py-10">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition cursor-pointer ${
                  activeTab === item.id
                    ? "bg-yellow-400 text-green-950"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon size={22} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM COLLAPSE BUTTON */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center text-white hover:text-yellow-300 transition cursor-pointer"
        >
          {collapsed ? (
            <ChevronsRight size={22} />
          ) : (
            <ChevronsLeft size={22} />
          )}
        </button>
      </div>
    </div>
  );
}