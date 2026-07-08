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

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/Campus', { replace: true });
    }
    loadSavedCredentials();
  }, [navigate]);

  const loadSavedCredentials = () => {
    try {
      const savedEmail = localStorage.getItem('rememberedEmail');
      const savedPassword = localStorage.getItem('rememberedPassword');
      const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
      
      if (savedEmail && savedPassword && savedRememberMe) {
        setEmail(savedEmail);
        setPassword(decryptPassword(savedPassword));
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const saveCredentials = (email: string, password: string, remember: boolean) => {
    try {
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', encryptPassword(password));
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
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
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
        localStorage.setItem('user', JSON.stringify(response.data.user));
        saveCredentials(email.trim(), password, rememberMe);
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

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    
    if (!checked) {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
      setPassword('');
    } else {
      if (email.trim() && password.trim()) {
        localStorage.setItem('rememberedEmail', email.trim());
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberMe', 'true');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 flex items-center justify-center px-3 sm:px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-40 sm:w-56 h-40 sm:h-56 border-2 border-white rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 sm:w-10 h-8 sm:h-10 text-green-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 8-4v6h2V7L12 2zm-7 9v4l7 4 7-4v-4l-7 4-7-4z" />
              </svg>
            </div>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-white">
              Al-Burhan Academy
            </h1>
            <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">
              Attendance Management Portal
            </p>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-green-100 mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (rememberMe && e.target.value.trim() && password.trim()) {
                    localStorage.setItem('rememberedEmail', e.target.value.trim());
                    localStorage.setItem('rememberedPassword', password);
                  }
                }}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border ${
                  error && !email ? 'border-red-500/50' : 'border-white/20'
                } rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm sm:text-base`}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-green-100 mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (rememberMe && email.trim() && e.target.value.trim()) {
                      localStorage.setItem('rememberedEmail', email.trim());
                      localStorage.setItem('rememberedPassword', e.target.value);
                    }
                  }}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 sm:pr-14 bg-white/10 border ${
                    error && !password ? 'border-red-500/50' : 'border-white/20'
                  } rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm sm:text-base`}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-green-100 hover:text-yellow-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a17.32 17.32 0 014.57-4.94M9.88 9.88A3 3 0 0114.12 14.12M6.1 6.1L17.9 17.9M21 12s-4-7-9-7c-.91 0-1.79.12-2.62.35" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-sm">
              <label className="flex items-center text-green-100 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="sr-only peer"
                  disabled={loading}
                />
                <div className="relative w-4 sm:w-5 h-4 sm:h-5 bg-white/10 border border-white/20 rounded-md peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-all duration-200 flex items-center justify-center flex-shrink-0">
                  {rememberMe && (
                    <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-green-100 group-hover:text-yellow-300 transition-colors text-xs sm:text-sm">
                  Remember Me
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/otp")}
                className="text-yellow-300 hover:text-yellow-200 transition-colors cursor-pointer text-xs sm:text-sm"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-green-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-green-100 text-xs sm:text-sm">
              "Seeking knowledge is an obligation upon every Muslim."
            </p>
            <p className="text-xs text-green-300 mt-3 sm:mt-4">
              © 2026 Al-Burhan Academy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}