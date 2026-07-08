import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const avatarUrl = "https://img.pikbest.com/png-images/20241128/man-avatar-3d-icon-isolated-on-transparent-background-_11144108.png!sw800";

export default function ProfileButton() {
  const [openProfile, setOpenProfile] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const role = authService.getUserRole();
      setUserRole(role);

      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUserEmail(response.data.user.email_address);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('user');
    navigate("/", { replace: true });
  };

  const getRoleDisplay = (role: string | null) => {
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpenProfile(!openProfile)}
        className="
          flex items-center gap-1 sm:gap-3 
          bg-white/10 hover:bg-white/20 
          backdrop-blur-xl 
          border border-white/20 hover:border-yellow-400/50 
          rounded-full sm:rounded-2xl
          px-1.5 sm:px-4 py-1 sm:py-1.5
          transition-all duration-300 
          group
          shadow-lg shadow-black/5
          hover:shadow-yellow-500/10
          cursor-pointer 
        "
      >
        <div className="relative flex items-center justify-center">
          {loading ? (
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-600/50 animate-pulse"></div>
          ) : (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-yellow-400/30 shadow-inner relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 border-2 border-emerald-900 rounded-full z-20 shadow-sm"></span>
        </div>

        {/* Hide text on mobile, show on tablet+ */}
        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-white text-sm font-medium truncate max-w-[100px]">
            {loading ? 'Loading...' : getRoleDisplay(userRole)}
          </span>
          <span className="text-green-100/50 text-xs truncate max-w-[100px]">
            {loading ? '...' : userEmail || 'user@email.com'}
          </span>
        </div>

        {/* Chevron - Hide on mobile */}
        <svg 
          className={`hidden sm:block w-4 h-4 text-white/60 transition-transform duration-300 ${openProfile ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {openProfile && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100/80 transform origin-top-right transition-all duration-200 z-50">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-b from-gray-50/50 to-transparent border-b border-gray-100">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {loading ? 'Loading...' : getRoleDisplay(userRole)}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {loading ? 'Loading...' : userEmail || 'user@email.com'}
              </p>
            </div>
          </div>

          <div className="p-2 border-b border-gray-100 bg-gray-50/30">
            <div className="px-3 py-1.5 flex justify-between items-center bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-100/50">
              <span>Role</span>
              <span className="uppercase tracking-wider text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                {loading ? 'Loading...' : getRoleDisplay(userRole)}
              </span>
            </div>
          </div>

          <div className="p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors duration-200 font-medium group"
            >
              <svg 
                className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}