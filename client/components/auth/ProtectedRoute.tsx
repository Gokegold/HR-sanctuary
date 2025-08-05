import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, User } from "@/contexts/AuthContext";
import MultiStageLogin from "./MultiStageLogin";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: User["role"][];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <MultiStageLogin onSuccess={() => window.location.reload()} />;
  }

  // Authenticated but no role restrictions
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check role permissions
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Not authorized for this role
  return <Navigate to="/unauthorized" replace />;
}
