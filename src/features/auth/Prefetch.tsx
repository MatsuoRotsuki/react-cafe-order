import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useCustomerMenuStore } from "../../stores/customerMenuStore";
import { useCustomerCartStore } from "../../stores/customerCartStore";
import { useAuthStore } from "../../stores/authStore";

const Prefetch = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const getMenuItems = useCustomerMenuStore((state) => state.getMenuItems);
  const getUserCart = useCustomerCartStore((state) => state.getUserCart);
  const cart = useCustomerCartStore((state) => state.cart);
  useEffect(() => {
    getMenuItems();
    if (currentUser.uid) getUserCart(currentUser.uid);
  }, [getMenuItems, getUserCart, currentUser]);
  useEffect(() => {
    console.log(cart);
  }, [cart]);
  return <Outlet />;
};

export default Prefetch;
