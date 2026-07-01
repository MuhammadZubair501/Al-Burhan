import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authService } from "../../services/authService";
import { otpService } from "../../services/otpService";
import { ArrowLeft, Mail, Shield, Clock } from "lucide-react";

const OTPPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Check if user exists
      const userRes = await authService.getUserByEmail(email);
      
      if (!userRes.success) {
        throw new Error(userRes.message || "No account found with this email");
      }

      // Store email for later use
      localStorage.setItem("resetEmail", email);

      // Send OTP
      const otpRes = await otpService.sendOTP(email);

      if (!otpRes.success) {
        throw new Error(otpRes.message || "Failed to send OTP");
      }

      const expiresAt = otpRes.expiresAt || Date.now() + 300000;
      const secondsLeft = Math.floor((expiresAt - Date.now()) / 1000);

      setStep(2);
      setTimeLeft(secondsLeft > 0 ? secondsLeft : 60);
      setOtp(new Array(6).fill(""));

      Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: 'Please check your email for the verification code.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || "User not found. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((v) => v !== "")) {
      if (timeLeft <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'OTP Expired',
          text: 'Please request a new OTP.',
        });
        return;
      }
      autoVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const autoVerify = async (finalOtp: string) => {
    setLoading(true);
    const email = localStorage.getItem("resetEmail") || "";

    try {
      const response = await otpService.verifyOTP(email, finalOtp);

      if (!response.success) {
        throw new Error(response.message || "Invalid OTP");
      }

      await Swal.fire({
        icon: 'success',
        title: 'Verified!',
        text: 'Redirecting to reset password...',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/reset-password");
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: err.message || "Invalid OTP. Please try again.",
      });

      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const email = localStorage.getItem("resetEmail") || "";
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email not found. Please start over.',
      });
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const otpRes = await otpService.sendOTP(email);

      if (!otpRes.success) {
        throw new Error(otpRes.message || "Failed to send OTP");
      }

      const expiresAt = otpRes.expiresAt || Date.now() + 300000;
      const secondsLeft = Math.floor((expiresAt - Date.now()) / 1000);

      setTimeLeft(secondsLeft > 0 ? secondsLeft : 60);
      setOtp(new Array(6).fill(""));

      Swal.fire({
        icon: 'success',
        title: 'OTP Resent!',
        text: 'New OTP has been sent to your email.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || "Failed to resend OTP",
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
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-green-100 hover:text-yellow-300 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-8 h-8 text-green-900" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            OTP Verification
          </h2>
          <p className="text-green-100 mt-1 text-sm">
            {step === 1 
              ? "Enter your registered email to continue" 
              : "Enter the 6-digit OTP sent to your email"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-200" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSendOTP()}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className={`w-full mt-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-green-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={value}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  disabled={loading}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-green-100 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {timeLeft > 0 ? (
                  <span>Expires in {timeLeft}s</span>
                ) : (
                  <span className="text-red-300">OTP Expired</span>
                )}
              </div>
              {timeLeft === 0 && (
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-yellow-300 hover:text-yellow-200 transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {loading && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
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

export default OTPPage;