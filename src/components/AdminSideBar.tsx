import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/coffee-logo.png";
import {
  AppstoreOutlined,
  MacCommandFilled,
  MacCommandOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useAuthStore } from "../stores/authStore";

type SideButtonProps = {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  text: string;
  href: string;
};

const SideButton = ({ icon, activeIcon, text, href }: SideButtonProps) => {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const isActive =
    currentPath.slice(1).split("/").includes(href.slice(1)) ||
    (currentPath === "/admin/orders" && href === "/admin/orders") ||
    (currentPath === "/admin/user" && href === "/admin/user") ||
    (currentPath === "/admin/menu" && href === "/admin/menu");

  return (
    <button
      className={
        isActive
          ? "flex w-full items-center justify-start gap-4 rounded-md bg-white py-2 ps-3 text-blue-500 transition-colors hover:bg-gray-300"
          : "flex w-full items-center justify-start gap-4 rounded-md py-2 ps-3 transition-colors hover:bg-white"
      }
      onClick={() => navigate(href)}
    >
      {isActive ? activeIcon : icon}
      <p className={`${isActive ? "font-semibold" : "font-medium"}`}>{text}</p>
    </button>
  );
};

const AdminSideBar = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="flex h-full min-w-[14rem] max-w-[16rem] flex-col items-center justify-start gap-8 px-3 pt-8">
      <div className="ml-[-8px] flex flex-col items-center justify-center gap-2">
        <img className="left-0 top-0 w-9" src={Logo} alt="logo" />
        <p className="font-semibold text-2xl">Kafemely</p>
      </div>
      <div className="flex w-full grow flex-col items-center justify-start gap-1">
        <SideButton
          icon={<MacCommandOutlined />}
          activeIcon={<MacCommandFilled />}
          text="Quản lý đơn hàng"
          href="/admin/orders"
        />
        <SideButton
          icon={<TeamOutlined />}
          activeIcon={<TeamOutlined />}
          text="Quản lý người dùng"
          href="/admin/user"
        />
        <SideButton
          icon={<AppstoreOutlined />}
          activeIcon={<AppstoreOutlined />}
          text="Quản lý thực đơn"
          href="/admin/menu"
        />
      </div>
      <Button onClick={logout} className="mb-5">
        Đăng xuất
      </Button>
    </div>
  );
};

export default AdminSideBar;
