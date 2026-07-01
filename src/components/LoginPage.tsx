import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { authService } from "../services/authService";
import { decryptPassword, encryptPassword } from "../utils/encryption";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/Campus', { replace: true });
    }

    // Load saved credentials if "Remember Me" was checked
    loadSavedCredentials();
  }, [navigate]);

  // Load saved credentials from localStorage
// Load credentials with decryption
const loadSavedCredentials = () => {
  try {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && savedPassword && savedRememberMe) {
      setEmail(savedEmail);
      setPassword(decryptPassword(savedPassword)); // Decrypt
      setRememberMe(true);
    }
  } catch (error) {
    console.error('Error loading saved credentials:', error);
  }
};

  // Save credentials if "Remember Me" is checked
const saveCredentials = (email: string, password: string, remember: boolean) => {
  try {
    if (remember) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', encryptPassword(password)); // Encrypt
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
    }
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    
    // Validate email
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    
    // Validate password
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email_address: email.trim(),
        password: password
      });

      if (response.success && response.data) {
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Save credentials if "Remember Me" is checked
        saveCredentials(email.trim(), password, rememberMe);
        
        // Navigate to Campus page
        navigate('/Campus', { replace: true });
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle remember me
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    
    if (!checked) {
      // If unchecked, remove saved credentials
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
      setPassword(''); // Clear password field for security
    } else {
      // If checked, save current credentials
      if (email.trim() && password.trim()) {
        localStorage.setItem('rememberedEmail', email.trim());
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberMe', 'true');
      }
    }
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-green-100 mb-2 text-sm font-medium">
                Email Address <span className="text-red-400">*</span>
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // If remember me is checked, update saved email
                  if (rememberMe && e.target.value.trim() && password.trim()) {
                    localStorage.setItem('rememberedEmail', e.target.value.trim());
                    localStorage.setItem('rememberedPassword', password);
                  }
                }}
                className={`w-full px-4 py-3 bg-white/10 border ${
                  error && !email ? 'border-red-500/50' : 'border-white/20'
                } rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-green-100 mb-2 text-sm font-medium">
                Password <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // If remember me is checked, update saved password
                    if (rememberMe && email.trim() && e.target.value.trim()) {
                      localStorage.setItem('rememberedEmail', email.trim());
                      localStorage.setItem('rememberedPassword', e.target.value);
                    }
                  }}
                  className={`w-full px-4 py-3 pr-14 bg-white/10 border ${
                    error && !password ? 'border-red-500/50' : 'border-white/20'
                  } rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-100 hover:text-yellow-300 transition-colors"
                  disabled={loading}
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

            {/* Remember and Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center text-green-100 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="sr-only peer"
                  disabled={loading}
                />
                <div className="relative w-5 h-5 bg-white/10 border border-white/20 rounded-md peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-all duration-200 flex items-center justify-center">
                  {rememberMe && (
                    <svg className="w-3 h-3 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-green-100 group-hover:text-yellow-300 transition-colors">
                  Remember Me
                </span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/otp")}
                className="text-yellow-300 hover:text-yellow-200 transition-colors cursor-pointer"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-green-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging...
                </span>
              ) : (
                'Login'
              )}
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