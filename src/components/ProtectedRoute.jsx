import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPath } from "../utils/paths";
import LuxuryLoader from "./LuxuryLoader";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LuxuryLoader
        fullscreen={false}
        message="Authenticating Luxury Portal"
        subtext="Verifying access..."
      />
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
