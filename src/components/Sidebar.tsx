import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  SquareDashedText,
  Cog,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export type TabType =
  | "dashboard"
  | "library"
  | "class"
  | "teacher"
  | "student"
  | "configuration"
  | "teacherAttendance"
  | "studentAttendance";

type Props = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  userRole?: string | null;
};

export default function Sidebar({ 
  activeTab, 
  setActiveTab,
  mobileOpen = false,
  setMobileOpen = () => {},
  userRole: propUserRole
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userRole, setUserRole] = useState<string | null>(propUserRole || null);

  useEffect(() => {
    if (!propUserRole) {
      setUserRole(authService.getUserRole());
    } else {
      setUserRole(propUserRole);
    }
  }, [propUserRole]);

  useEffect(() => {
    if (
      activeTab === "teacherAttendance" ||
      activeTab === "studentAttendance"
    ) {
      setAttendanceOpen(true);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobileOpen]);

  const navigate = useNavigate();

  // ============================================
  // GET MENUS BASED ON ROLE
  // ============================================
  const getMenus = () => {
    const baseMenus = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "library", label: "Library", icon: BookOpen },
    ];

    // Admin gets all menus including Student (management)
    if (userRole === 'admin' || userRole === 'super_admin') {
      return [
        ...baseMenus,
        { id: "class", label: "Classes", icon: SquareDashedText },
        { id: "teacher", label: "Teachers", icon: GraduationCap },
        { id: "student", label: "Students", icon: Users }, // Student management
        { id: "configuration", label: "Configuration", icon: Cog },
      ];
    }

    // Teacher and Naqeeb get only Dashboard and Library
    if (userRole === 'teacher' || userRole === 'naqeeb') {
      return baseMenus;
    }

    // Student gets only Dashboard and Library
    if (userRole === 'student') {
      return baseMenus;
    }

    return baseMenus;
  };

  const menus = getMenus();

  // ============================================
  // ATTENDANCE ACCESS PERMISSIONS
  // ============================================
  const canAccessAttendance = userRole === 'teacher' || userRole === 'naqeeb' || userRole === 'admin' || userRole === 'super_admin';
  const canAccessTeacherAttendance = userRole === 'admin' || userRole === 'super_admin';
  const canAccessStudentAttendance = userRole === 'teacher' || userRole === 'naqeeb' || userRole === 'admin' || userRole === 'super_admin';

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  const goToCampusPage = () => {
    if (userRole === 'admin' || userRole === 'super_admin') {
      navigate("/Campus");
    } else {
      navigate("/MainDeshboard");
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  if (isMobile && !mobileOpen) {
    return null;
  }

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          flex flex-col justify-between 
          bg-white/10 backdrop-blur-xl 
          border-r border-white/20 
          transition-all duration-300 
          ${
            isMobile
              ? `fixed inset-y-0 left-0 z-50 w-[280px] sm:w-72 transform ${
                  mobileOpen ? "translate-x-0" : "-translate-x-full"
                } shadow-2xl`
              : collapsed
              ? "w-20"
              : "w-72"
          }
        `}
      >
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 p-2 text-white hover:text-yellow-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer z-10"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo / Brand */}
          <button
            className="w-full p-3 flex items-center gap-3 border-b border-white/30 hover:bg-white/10 transition-colors text-left cursor-pointer"
            onClick={goToCampusPage}
          >
            <div className="w-12 h-12 md:w-14 h-14 flex-shrink-0">
              <img src="./logo6.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            {(!collapsed || isMobile) && (
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">
                Al-Burhan
              </h1>
            )}
          </button>

          {/* Menu Items */}
          <div className="px-2 sm:px-3 space-y-1.5 sm:space-y-2 py-4 sm:py-6 md:py-10">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      closeMobileSidebar();
                    }}
                    className={`
                      w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition cursor-pointer text-sm sm:text-base
                      ${
                        activeTab === item.id
                          ? "bg-yellow-400 text-green-950 shadow-lg shadow-yellow-400/20"
                          : "text-white hover:bg-white/10"
                      }
                      ${collapsed && !isMobile ? "justify-center" : ""}
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                  </button>

                  {/* Attendance Dropdown - Only under Dashboard for teachers/naqeeb/admin */}
                  {item.id === "dashboard" && canAccessAttendance && (
                    <div className="mt-1 sm:mt-2">
                      <button
                        onClick={() => {
                          if (!attendanceOpen) {
                            setAttendanceOpen(true);
                            if (userRole === 'teacher' || userRole === 'naqeeb') {
                              setActiveTab("studentAttendance");
                            } else {
                              setActiveTab("teacherAttendance");
                            }
                          } else {
                            setAttendanceOpen(false);
                          }
                        }}
                        className={`
                          w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition cursor-pointer text-sm sm:text-base
                          ${
                            activeTab === "teacherAttendance" ||
                            activeTab === "studentAttendance"
                              ? "bg-yellow-400 text-green-950 shadow-lg shadow-yellow-400/20"
                              : "text-white hover:bg-white/10"
                          }
                          ${collapsed && !isMobile ? "justify-center" : ""}
                        `}
                      >
                        <div className={`flex items-center gap-3 sm:gap-4 ${collapsed && !isMobile ? "justify-center" : ""}`}>
                          <Users size={20} className="flex-shrink-0" />
                          {(!collapsed || isMobile) && <span>Attendance</span>}
                        </div>
                        {(!collapsed || isMobile) && (
                          attendanceOpen ? <ChevronDown size={16} className="flex-shrink-0" /> : <ChevronRight size={16} className="flex-shrink-0" />
                        )}
                      </button>

                      {(!collapsed || isMobile) && attendanceOpen && (
                        <div className="ml-6 sm:ml-8 mt-1 space-y-1">
                          {/* Teacher Attendance - Admin only */}
                          {canAccessTeacherAttendance && (
                            <button
                              onClick={() => {
                                setActiveTab("teacherAttendance");
                                closeMobileSidebar();
                              }}
                              className={`
                                w-full text-left px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition
                                ${
                                  activeTab === "teacherAttendance"
                                    ? "bg-yellow-300 text-green-950 font-medium"
                                    : "text-gray-300 hover:bg-white/10"
                                }
                              `}
                            >
                              Teacher Attendance
                            </button>
                          )}
                          
                          {/* Student Attendance - Admin, Teacher, Naqeeb */}
                          {canAccessStudentAttendance && (
                            <button
                              onClick={() => {
                                setActiveTab("studentAttendance");
                                closeMobileSidebar();
                              }}
                              className={`
                                w-full text-left px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition
                                ${
                                  activeTab === "studentAttendance"
                                    ? "bg-yellow-300 text-green-950 font-medium"
                                    : "text-gray-300 hover:bg-white/10"
                                }
                              `}
                            >
                              Student Attendance
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapse Toggle - Desktop only */}
        {!isMobile && (
          <div className="p-3 sm:p-4 border-t border-white/10">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center text-white hover:text-yellow-300 transition cursor-pointer p-2 hover:bg-white/10 rounded-lg"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
            </button>
          </div>
        )}
      </div>
    </>
  );
}