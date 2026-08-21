import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPath } from "../utils/paths";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-primary">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold tracking-wider uppercase opacity-60">Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={getPath(requiredRole === "admin" ? "/admin/login" : "/login")}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (requiredRole === "admin") {
    const roles = user.roles || (user.role ? [user.role] : []);
    if (!roles.includes("admin") && user.role !== "admin") {
      return <Navigate to={getPath("/admin/login")} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
