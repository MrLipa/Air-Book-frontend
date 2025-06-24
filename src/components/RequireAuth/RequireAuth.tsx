import { FC } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";
import { AuthContextProps } from "@/types";

interface RequireAuthProps {
  allowedRoles?: string[];
}

export const RequireAuth: FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { auth } = useAuth() as AuthContextProps;
  const location = useLocation();

  const hasRequiredRole = allowedRoles?.includes(String(auth?.role));

  if (auth === undefined || auth === null) {
    return <div>Loading...</div>;
  }

  if (hasRequiredRole) {
    return <Outlet />;
  }

  if (auth?.accessToken && !hasRequiredRole) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};
