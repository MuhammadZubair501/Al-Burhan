import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authService } from "../../services/authService";
import { Eye, EyeOff, ArrowLeft, Lock, Shield } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please start the password reset process again.',
      });
      navigate("/");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(newPassword);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(email, newPassword);

      if (!response.success) {
        throw new Error(response.message || "Failed to reset password");
      }

      await Swal.fire({
        icon: 'success',
        title: 'Password Reset!',
        text: 'Your password has been changed successfully. Please login with your new password.',
        timer: 3000,
        showConfirmButton: true,
      });

      // Clear stored email and redirect to login
      localStorage.removeItem("resetEmail");
      navigate("/");
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 relative overflow-hidden px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 border-2 border-white rounded-full"></div>
      </div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/otp")}
          className="flex items-center gap-2 text-green-100 hover:text-yellow-300 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to OTP</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Lock className="w-8 h-8 text-green-900" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Reset Password
          </h2>
          <p className="text-green-100 mt-1 text-sm">
            Create a new password for your account
          </p>
          <p className="text-green-200/60 text-xs mt-2 truncate">
            {email}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="relative mb-3">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-200" />
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-200 hover:text-yellow-300 transition-colors"
              disabled={loading}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Strength Bar */}
          {newPassword && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-green-200">
                  Password Strength:{" "}
                  <span className="font-medium">
                    {strengthLabels[strength - 1] || "Weak"}
                  </span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    strengthColors[strength - 1] || "bg-red-500"
                  }`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative mb-4">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-200" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-200 hover:text-yellow-300 transition-colors"
              disabled={loading}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-green-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-green-100 text-xs opacity-75">
            "Seeking knowledge is an obligation upon every Muslim."
          </p>
          <p className="text-xs text-green-300 mt-2 opacity-50">
            © 2026 Al-Burhan Academy
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;