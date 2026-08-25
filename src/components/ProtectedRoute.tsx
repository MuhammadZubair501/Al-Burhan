import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[]; // Optional: restrict access to specific roles
  showTimer?: boolean; // Optional: show session timer (default: true)
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles, 
  showTimer = true 
}: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If roles are required, check if user has the required role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!userRole || !requiredRoles.includes(userRole)) {
      // User doesn't have the required role, redirect to login or unauthorized page
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and has required role (if any), render children with session timer
  return (
    <>
      {/* {showTimer && <SessionTimer />} */}
      {children}
    </>
  );
}