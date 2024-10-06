import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const RequireAuth = () => {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <>
      {currentUser.uid ? (
        <Outlet />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default RequireAuth;
