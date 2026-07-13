import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

// ============================================
// GENERIC WARNING CONFIGURATION - Days, Hours, Minutes
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

export const useSessionManager = ({ skip = false } = {}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpiring, setIsExpiring] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    authService.logout();
    setShowWarning(false);
    navigate('/login', { state: { sessionExpired: true } });
  }, [navigate]);

  const handleExtendSession = useCallback(async () => {
    try {
      const response = await authService.extendSession();
      if (response.success) {
        setShowWarning(false);
        setIsExpiring(false);
        console.log('✅ Session extended successfully');
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
      handleLogout();
    }
  }, [handleLogout]);

  // Format time with days, hours, minutes, seconds
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
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
    if (minutes > 0 || hours > 0 || days > 0) {
      timeString += `${minutes}m `;
    }
    timeString += `${seconds}s`;
    
    return timeString.trim();
  }, []);

  useEffect(() => {
    // If skip is true, skip all session checks and clean up
    if (skip) {
      // Reset any warning state
      setShowWarning(false);
      setIsExpiring(false);
      return;
    }

    // Check session status every second for better accuracy
    const interval = setInterval(() => {
      const { isValid, remainingTime } = authService.checkSessionStatus();
      
      if (!isValid) {
        handleLogout();
        return;
      }

      setRemainingTime(remainingTime);
      setTimeLeft(formatTime(remainingTime));
      
      // Check if session is expiring using the generic warning config
      const isExpiringNow = remainingTime <= SESSION_WARNING_MS && remainingTime > 0;
      setIsExpiring(isExpiringNow);
      
      // Show warning when session is expiring
      if (isExpiringNow) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000); // Check every second for accurate countdown

    // Initial check
    const { isValid, remainingTime } = authService.checkSessionStatus();
    if (!isValid) {
      handleLogout();
    } else {
      setRemainingTime(remainingTime);
      setTimeLeft(formatTime(remainingTime));
      const isExpiringNow = remainingTime <= SESSION_WARNING_MS && remainingTime > 0;
      setIsExpiring(isExpiringNow);
      setShowWarning(isExpiringNow);
    }

    return () => clearInterval(interval);
  }, [handleLogout, formatTime, skip]);

  return {
    showWarning,
    remainingTime,
    timeLeft,
    isExpiring,
    handleLogout,
    handleExtendSession
  };
};