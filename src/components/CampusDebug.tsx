import React, { useEffect, useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { authService } from '../services/authService';

export const CampusDebug: React.FC = () => {
  const { campusId, campusName, userRole, isLoading, refreshCampusData } = useCampus();
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setTokenData(payload);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  if (isLoading) {
    return <div className="text-xs text-gray-400">Loading campus data...</div>;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/90 backdrop-blur-sm text-white text-xs p-3 rounded-lg border border-white/10 max-w-xs shadow-2xl">
      <div className="font-bold mb-1 text-yellow-400">🏫 Campus Debug</div>
      
      <div className="space-y-0.5">
        <div>Role: <span className="text-blue-400 font-mono">{userRole || 'NULL'}</span></div>
        <div>Campus ID: <span className="text-yellow-400 font-mono font-bold">{campusId ?? 'NULL'}</span></div>
        <div>Campus Name: <span className="text-green-400">{campusName || 'NULL'}</span></div>
        <div>window.CampusID: <span className="text-purple-400 font-mono">{(window as any).CampusID ?? 'NULL'}</span></div>
      </div>
      
      <div className="mt-1 pt-1 border-t border-white/10">
        <div className="text-[10px] text-gray-400">localStorage:</div>
        <div className="text-[10px] font-mono">
          userCampusId: <span className="text-pink-400">{localStorage.getItem('userCampusId') || 'NULL'}</span>
        </div>
        <div className="text-[10px] font-mono">
          CampusID: <span className="text-pink-400">{localStorage.getItem('CampusID') || 'NULL'}</span>
        </div>
        <div className="text-[10px] font-mono">
          selectedCampusId: <span className="text-pink-400">{localStorage.getItem('selectedCampusId') || 'NULL'}</span>
        </div>
      </div>
      
      {tokenData && (
        <div className="mt-1 pt-1 border-t border-white/10">
          <div className="text-[10px] text-gray-400">Token Payload:</div>
          <div className="text-[10px] font-mono">
            campusId: <span className="text-orange-400">{tokenData.campusId ?? 'NULL'}</span>
          </div>
          <div className="text-[10px] font-mono">
            role: <span className="text-blue-400">{tokenData.role || 'NULL'}</span>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => {
          refreshCampusData();
          authService.debugAuthState();
        }}
        className="mt-2 w-full px-2 py-1 bg-yellow-400/20 hover:bg-yellow-400/30 rounded text-yellow-300 text-[10px] transition"
      >
        🔄 Refresh & Debug
      </button>
    </div>
  );
};