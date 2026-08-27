import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import CampusPage from "./Campus/CampusPage";
import LoginPage from "./components/LoginPage";
import MainDeshboard from "./components/MainDeshboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import OTPPage from "./components/ResetPassword/OTPPage";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { SessionWarning } from "./components/SessionWarning";
import { useSessionManager } from "./hooks/useSessionManager";
import { authService } from "./services/authService";
import { CampusProvider } from "./context/CampusContext";

// Wrapper component to handle session management
function SessionManagerWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isResetPath = ['/otp', '/reset-password'].includes(location.pathname);
  const { showWarning, timeLeft, handleLogout, handleExtendSession } = 
    useSessionManager({ skip: isResetPath });

  return (
    <>
      {showWarning && (
        <SessionWarning 
          onExtend={handleExtendSession}
          onLogout={handleLogout}
          timeLeft={timeLeft}
        />
      )}
      {children}
    </>
  );
}

// Role-based redirect component
function RoleRedirect() {
  const userRole = authService.getUserRole();
  
  if (userRole === 'admin' || userRole === 'super_admin') {
    return <Navigate to="/Campus" replace />;
  } else if (userRole === 'teacher' || userRole === 'naqeeb' || userRole === 'student') {
    return <Navigate to="/MainDeshboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <CampusProvider>
      <BrowserRouter>
        <SessionManagerWrapper>
          <Routes>
            {/* OTP Page */}
            <Route path="/otp" element={<OTPPage />} />
            
            {/* Reset Password */}
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Public Route - Login */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            
            {/* Role-based redirect */}
            <Route path="/dashboard" element={<RoleRedirect />} />
            
            {/* Campus Page - Admin only */}
            <Route 
              path="/Campus" 
              element={
                <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
                  <CampusPage />
                </RoleBasedRoute>
              } 
            />
            
            {/* Main Dashboard - Accessible by all authenticated users */}
            <Route 
              path="/MainDeshboard" 
              element={
                <ProtectedRoute>
                  <MainDeshboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/sections/:classId" 
              element={
                <ProtectedRoute>
                  <MainDeshboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </SessionManagerWrapper>
      </BrowserRouter>
    </CampusProvider>
  );
}