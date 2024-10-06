import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useUsersStore } from "../../stores/usersStore";
import { useEffect } from "react";
import { useMenuStore } from "../../stores/menusStore";

const CheckAdmin = () => {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const getUsers = useUsersStore((state) => state.getUsers);
  const getCategories = useMenuStore((state) => state.getCategories);
  const getMenuItems = useMenuStore((state) => state.getMenuItems);
  useEffect(() => {
    getUsers();
    getCategories();
    getMenuItems();
  }, [getUsers, getCategories, getMenuItems]);

  return (
    <>
      {currentUser.role === "admin" ? (
        <Outlet />
      ) : (
        <Navigate to="/menu" state={{ from: location }} />
      )}
    </>
  );
};

export default CheckAdmin;
