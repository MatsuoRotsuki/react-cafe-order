import React from "react";
import AdminSideBar from "./AdminSideBar";

type PropType = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: PropType) => {
  return (
    <div className="flex h-screen w-screen shadow-md">
      <AdminSideBar />
      <div className="relative h-full grow overflow-y-auto bg-neutral-100 p-3">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
