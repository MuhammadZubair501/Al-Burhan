import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw } from 'lucide-react';
import { authService } from '../services/authService';

// ============================================
// GENERIC WARNING CONFIGURATION
// ============================================
const parseWarningConfig = () => {
  const days = parseInt(import.meta.env.VITE_SESSION_WARNING_DAYS || '0');
  const hours = parseInt(import.meta.env.VITE_SESSION_WARNING_HOURS || '0');
  const minutes = parseInt(import.meta.env.VITE_SESSION_WARNING_MINUTES || '0');
  
  const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
  
  if (totalMinutes === 0) {
    return 3 * 60 * 1000; // Default: 3 minutes
  }
  
  return totalMinutes * 60 * 1000;
};

const SESSION_WARNING_MS = parseWarningConfig();

interface SessionTimerProps {
  showExtend?: boolean;
}

export default function SessionTimer({ showExtend = true }: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpiring, setIsExpiring] = useState<boolean>(false);
  const [sessionLabel, setSessionLabel] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get session label from authService
    setSessionLabel(authService.getSessionLabel());
    
    const updateTimer = () => {
      const { remainingTime, isValid } = authService.checkSessionStatus();
      
      if (!isValid) {
        setTimeLeft("Expired");
        setIsExpiring(true);
        // Auto logout after 3 seconds if expired
        setTimeout(() => {
          authService.logout();
          navigate('/login', { state: { sessionExpired: true } });
        }, 3000);
        return;
      }

      // Format time display with days, hours, minutes
      const totalSeconds = Math.floor(remainingTime / 1000);
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;
      
      let timeString = '';
      if (days > 0) {
        timeString += `${days}d `;
      }
      if (hours > 0 || days > 0) {
        timeString += `${hours}h `;
      }
      timeString += `${minutes}m ${seconds}s`;
      
      setTimeLeft(timeString);
      
      // Set warning state using env variable
      setIsExpiring(remainingTime <= SESSION_WARNING_MS);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleExtendSession = async () => {
    try {
      const response = await authService.extendSession();
      if (response.success) {
        // Refresh session label
        setSessionLabel(authService.getSessionLabel());
        setIsExpiring(false);
        console.log("✅ Session extended successfully");
      }
    } catch (error) {
      console.error("Failed to extend session:", error);
    }
  };

  // Don't render if no token
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const timerColor = isExpiring ? 'text-red-400' : 'text-green-400';
  const bgColor = isExpiring ? 'bg-red-500/20 border-red-500/30' : 'bg-white/10 border-white/20';

  return (
    <>
      {/* Desktop Timer - Top Right */}
      <div className={`hidden md:flex fixed top-4 right-1/2 z-50 items-center gap-2 ${bgColor} backdrop-blur-xl border rounded-xl px-3 py-1.5 shadow-lg transition-colors duration-300`}>
        <Clock size={16} className={timerColor} />
        <span className={`text-sm font-mono font-medium ${timerColor}`}>
          {timeLeft}
        </span>
        {isExpiring && (
          <span className="text-xs text-red-400 animate-pulse ml-1">
            ⚠️ Expiring
          </span>
        )}
        {showExtend && isExpiring && (
          <button
            onClick={handleExtendSession}
            className="ml-1 p-1 hover:bg-white/10 rounded-lg transition-colors"
            title={`Extend Session (${sessionLabel})`}
          >
            <RefreshCw size={14} className="text-yellow-400 hover:text-yellow-300" />
          </button>
        )}
      </div>

      {/* Mobile Timer - Bottom Center */}
      <div className={`md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 ${bgColor} backdrop-blur-xl border rounded-xl px-3 py-1.5 shadow-lg transition-colors duration-300`}>
        <Clock size={14} className={timerColor} />
        <span className={`text-xs font-mono font-medium ${timerColor}`}>
          {timeLeft}
        </span>
        {isExpiring && (
          <span className="text-xs text-red-400 animate-pulse ml-1">⚠️</span>
        )}
        {showExtend && isExpiring && (
          <button
            onClick={handleExtendSession}
            className="ml-0.5 p-0.5 hover:bg-white/10 rounded transition-colors"
            title="Extend Session"
          >
            <RefreshCw size={12} className="text-yellow-400 hover:text-yellow-300" />
          </button>
        )}
      </div>
    </>
  );
}