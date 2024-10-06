import React from "react";

type PropsType = {
  children: React.ReactNode;
};

const DefaultLayout = ({ children }: PropsType) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-700">
      {children}
    </div>
  );
};

export default DefaultLayout;
