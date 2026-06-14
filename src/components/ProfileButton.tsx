import { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatarUrl = "https://img.pikbest.com/png-images/20241128/man-avatar-3d-icon-isolated-on-transparent-background-_11144108.png!sw800";





export default function ProfileButton() {
    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();
    const goToLogin = () => {

        navigate("/");
      };



    
  return (
<div className="flex justify-end items-center">
  <div className="relative">

    {/* Modern & Sleek Profile Button */}
    <button
      onClick={() => setOpenProfile(!openProfile)}
<<<<<<< HEAD
      className="cursor-pointer flex items-center gap-3 bg-white/10 hover:bg-white/20 active:scale-98 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 pl-2 pr-4 py-1.5 rounded-full text-white shadow-lg shadow-black/5 group"
    >
      {/* Avatar Container with Animated Glow */}
      <div className="relative flex items-center justify-center ">
=======
      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 active:scale-98 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 pl-2 pr-4 py-1.5 rounded-full text-white shadow-lg shadow-black/5 group"
    >
      {/* Avatar Container with Animated Glow */}
      <div className="relative flex items-center justify-center">
>>>>>>> 87e4fae1d57893fb48bd547abb54780f8bfd22d5
        <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover border border-white/40 shadow-inner relative z-10 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Pulse Online Dot */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-900 rounded-full z-20 shadow-sm animate-pulse"></span>
      </div>

      {/* Name and Chevron */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tracking-wide">Admin</span>
        <svg 
          className={`w-4 h-4 text-white/60 transition-transform duration-300 ${openProfile ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    {/* Modern Premium Dropdown Menu */}
    {openProfile && (
      <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100/80 transform origin-top-right transition-all duration-200 animate-in fade-in slide-in-from-top-2  z-21">

        {/* User Header Details */}
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
              Admin User
            </p>
            <p className="text-xs text-gray-400 truncate">
              admin@school.com
            </p>
          </div>
        </div>

        {/* Badge & Quick Links Section */}
        <div className="p-2 border-b border-gray-100 bg-gray-50/30">
          <div className="px-3 py-1.5 flex justify-between items-center bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-100/50">
            <span>Role</span>
            <span className="uppercase tracking-wider text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
              Administrator
            </span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="p-1.5">
          <button
           type="button"
          onClick={() => goToLogin()}
<<<<<<< HEAD
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors duration-200 font-medium group cursor-pointer"
=======
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors duration-200 font-medium group"
>>>>>>> 87e4fae1d57893fb48bd547abb54780f8bfd22d5
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
</div>
  );
}