import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

interface CampusContextType {
  campusId: number | null;
  campusName: string | null;
  setCampusId: (id: number) => void;
  setCampusName: (name: string) => void;
  userRole: string | null;
  isLoading: boolean;
  refreshCampusData: () => void;
  selectedCampusId: number | null;
  setSelectedCampus: (id: number) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};

interface CampusProviderProps {
  children: ReactNode;
}

export const CampusProvider: React.FC<CampusProviderProps> = ({ children }) => {
  const [campusId, setCampusId] = useState<number | null>(null);
  const [campusName, setCampusName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);

  const loadCampusData = async () => {
    try {
      setIsLoading(true);
      
      const role = authService.getUserRole();
      setUserRole(role);
      
      console.log('🔄 Loading campus data for role:', role);

      // Try to get campus from authService first
      let userCampusId = authService.getUserCampusId();
      let userCampusName = authService.getUserCampusName();
      
      // If not found, try to get from token directly
      if (!userCampusId) {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('📚 Reading campus from token directly:', payload);
            userCampusId = payload.campusId;
          }
        } catch (error) {
          console.error('Error reading token:', error);
        }
      }
      
      console.log('👤 Final campus ID:', userCampusId);
      console.log('👤 Final campus name:', userCampusName);
      
      if (role === 'admin' || role === 'super_admin') {
        // Admin: Use selected campus from localStorage
        const savedCampusId = localStorage.getItem('selectedCampusId');
        const savedCampusName = localStorage.getItem('selectedCampusName');
        
        if (savedCampusId) {
          console.log('📚 Admin using campus from localStorage:', savedCampusId);
          const id = parseInt(savedCampusId);
          setCampusId(id);
          setCampusName(savedCampusName || 'Campus');
          setSelectedCampusId(id);
          window.CampusID = id;
        } else if (userCampusId) {
          console.log('📚 Admin using campus from user data:', userCampusId);
          setCampusId(userCampusId);
          setCampusName(userCampusName || 'Campus');
          setSelectedCampusId(userCampusId);
          window.CampusID = userCampusId;
        } else {
          console.log('📚 No campus selected for admin, using default');
          setCampusId(1);
          setCampusName('Select Campus');
          setSelectedCampusId(1);
        }
      } else {
        // Non-admin: Use campus from login
        if (userCampusId) {
          console.log('📚 Using campus ID from user data:', userCampusId);
          setCampusId(userCampusId);
          setCampusName(userCampusName || 'Campus');
          setSelectedCampusId(userCampusId);
          window.CampusID = userCampusId;
          localStorage.setItem('CampusID', String(userCampusId));
          localStorage.setItem('selectedCampusId', String(userCampusId));
        } else {
          console.warn('⚠️ No campus ID found for non-admin user, using default');
          // Try to get from localStorage as fallback
          const savedCampusId = localStorage.getItem('selectedCampusId');
          if (savedCampusId) {
            console.log('📚 Using fallback campus from localStorage:', savedCampusId);
            const id = parseInt(savedCampusId);
            setCampusId(id);
            setSelectedCampusId(id);
            window.CampusID = id;
          } else {
            // Final fallback
            setCampusId(1);
            setSelectedCampusId(1);
            window.CampusID = 1;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error loading campus data:', error);
      // Try to recover from localStorage
      const savedCampusId = localStorage.getItem('selectedCampusId');
      if (savedCampusId) {
        const id = parseInt(savedCampusId);
        setCampusId(id);
        setSelectedCampusId(id);
        window.CampusID = id;
      } else {
        setCampusId(1);
        setSelectedCampusId(1);
        window.CampusID = 1;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampusData();
  }, []);

  // Update window.CampusID when campusId changes
  useEffect(() => {
    if (campusId !== null) {
      console.log('📝 Setting CampusID to:', campusId);
      (window as any).CampusID = campusId;
      localStorage.setItem('CampusID', String(campusId));
    }
  }, [campusId]);

  // Method to set selected campus (for admin)
  const setSelectedCampus = (id: number) => {
    console.log('📚 Setting selected campus to:', id);
    setSelectedCampusId(id);
    setCampusId(id);
    localStorage.setItem('selectedCampusId', String(id));
    localStorage.setItem('selectedCampusName', 'Campus');
    localStorage.setItem('CampusID', String(id));
    (window as any).CampusID = id;
  };

  const refreshCampusData = () => {
    console.log('🔄 Refreshing campus data...');
    loadCampusData();
  };

  const value = {
    campusId,
    campusName,
    setCampusId,
    setCampusName,
    userRole,
    isLoading,
    refreshCampusData,
    selectedCampusId,
    setSelectedCampus
  };

  return (
    <CampusContext.Provider value={value}>
      {children}
    </CampusContext.Provider>
  );
};