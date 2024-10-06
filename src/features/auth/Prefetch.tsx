import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useCustomerMenuStore } from "../../stores/customerMenuStore";

const Prefetch = () => {
  const getCategories = useCustomerMenuStore((state) => state.getCategories);
  useEffect(() => {
    getCategories();
  }, [getCategories]);
  return <Outlet />;
};

export default Prefetch;
