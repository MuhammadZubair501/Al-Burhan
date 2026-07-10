// SessionWarning.tsx
import React, { useState, useEffect } from 'react';

interface SessionWarningProps {
  onExtend: () => void;
  onLogout: () => void;
  timeLeft?: string;
}

export const SessionWarning: React.FC<SessionWarningProps> = ({ 
  onExtend, 
  onLogout, 
  timeLeft = "3:00" 
}) => {
  const [timeLeftState, setTimeLeftState] = useState(timeLeft);

  useEffect(() => {
    setTimeLeftState(timeLeft);
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4 relative">
        {/* Glass morphism card matching login page */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
          {/* Decorative rings - matching login page */}
          <div className="absolute -top-10 -right-10 w-32 h-32 border-4 border-yellow-400/20 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border-4 border-yellow-400/20 rounded-full"></div>
          
          <div className="text-center relative">
            {/* Icon - matching login page style */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg mb-5">
              <svg className="w-10 h-10 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Title - matching login page */}
            <h3 className="text-2xl font-bold text-white mb-2">
              Session Expiring Soon!
            </h3>
            
            {/* Subtitle */}
            <p className="text-green-100 mb-3">
              Your session will expire in
            </p>
            
            {/* Timer - highlighted with yellow */}
            <div className="text-4xl font-bold text-yellow-400 mb-4 font-mono bg-white/5 border border-white/10 rounded-xl py-3 px-4 inline-block">
              {timeLeftState}
            </div>
            
            {/* Message */}
            <p className="text-green-100 text-sm mb-6">
              Click "Stay Logged In" to continue working without interruption.
            </p>
            
            {/* Buttons - matching login page button style */}
            <div className="flex gap-3">
              <button
                onClick={onExtend}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Stay Logged In
              </button>
              <button
                onClick={onLogout}
                className="flex-1 px-4 py-3 bg-red-500/80 hover:bg-red-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm border border-red-400/30"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};