import React from "react";
import NavigationBar from "./NavigationBar";

type PropsType = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: PropsType) => {
  return (
    <div className="flex h-screen w-screen shadow-md flex-col">
      <NavigationBar />
      <div className="relative h-full grow overflow-y-auto bg-neutral-50 p-3">
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
