import React, { useState, useEffect } from 'react';

interface SessionWarningProps {
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionWarning: React.FC<SessionWarningProps> = ({ onExtend, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) {
      onLogout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onLogout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Session Expiring Soon!</h3>
          
          <p className="text-gray-600 mb-2">
            Your session will expire in
          </p>
          
          <div className="text-3xl font-bold text-yellow-600 mb-4">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Click "Stay Logged In" to continue working without interruption.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowModal(false);
                onExtend();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Stay Logged In
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                onLogout();
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};