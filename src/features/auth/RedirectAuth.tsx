import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const RedirectAuth = () => {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <>
      {currentUser.uid ? (
        currentUser.role === "customer" ? (
          <Navigate to="/menu" state={{ from: location }} />
        ) : (
          <Navigate to="/admin/orders" state={{ from: location }} />
        )
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default RedirectAuth;
