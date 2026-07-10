import CampusPage from "./Campus/CampusPage";
import LoginPage from "./components/LoginPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainDeshboard from "./components/MainDeshboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import OTPPage from "./components/ResetPassword/OTPPage";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { SessionWarning } from "./components/SessionWarning";
import { useSessionManager } from "./hooks/useSessionManager";

// Wrapper component to handle session management
function SessionManagerWrapper({ children }: { children: React.ReactNode }) {
  const { showWarning, timeLeft, handleLogout, handleExtendSession } = useSessionManager();

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

export default function App() {
  return (
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
          
          {/* Protected Routes - Require Authentication */}
          <Route 
            path="/Campus" 
            element={
              <ProtectedRoute>
                <CampusPage />
              </ProtectedRoute>
            } 
          />
          
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
          
          {/* Example: Role-Based Protected Route (Admin only) */}
          <Route 
            path="/admin" 
            element={
              <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
                <div>Admin Dashboard</div>
              </RoleBasedRoute>
            } 
          />
          
          {/* Example: Role-Based Protected Route (Teacher only) */}
          <Route 
            path="/teacher-dashboard" 
            element={
              <RoleBasedRoute allowedRoles={['admin', 'super_admin', 'teacher']}>
                <div>Teacher Dashboard</div>
              </RoleBasedRoute>
            } 
          />
        </Routes>
      </SessionManagerWrapper>
    </BrowserRouter>
  );
}