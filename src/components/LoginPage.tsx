import { useState } from "react";
import { useNavigate } from 'react-router-dom';



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 2. Create a function to handle the button click
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from reloading if using a form
    
    // You can add login logic here (like checking a password)
    
    // 3. Navigate to the Campus page
    navigate('/Campus');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 border-2 border-white rounded-full"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-green-900"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 8-4v6h2V7L12 2zm-7 9v4l7 4 7-4v-4l-7 4-7-4z" />
              </svg>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">
              Al-Burhan Academy
            </h1>

            <p className="text-green-100 mt-2">
              Attendance Management Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-green-100 mb-2 text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>

          {/* Password */}
<div>
  <label className="block text-green-100 mb-2 text-sm font-medium">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      className="w-full px-4 py-3 pr-14 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-100 hover:text-yellow-300 transition-colors"
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a17.32 17.32 0 014.57-4.94M9.88 9.88A3 3 0 0114.12 14.12M6.1 6.1L17.9 17.9M21 12s-4-7-9-7c-.91 0-1.79.12-2.62.35"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  </div>
</div>
            {/* Remember */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center text-green-100">
                <input
                  type="checkbox"
                  className="mr-2 accent-yellow-400"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-yellow-300 hover:text-yellow-200"
              >
                Forgot Password?
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Login In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-green-100 text-sm">
              "Seeking knowledge is an obligation upon every Muslim."
            </p>

            <p className="text-xs text-green-300 mt-4">
              © 2026 Al-Burhan Academy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}