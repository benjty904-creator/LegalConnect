import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2B5B]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // If attempting to access admin dashboard, redirect to admin login
    if (allowedRoles && allowedRoles.includes("admin") && !allowedRoles.includes("citizen")) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Wrong role - redirect to proper dashboard
    if (user.role === "citizen") {
      return <Navigate to="/user-dashboard" replace />;
    } else if (user.role === "lawyer") {
      return <Navigate to="/lawyer-dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

