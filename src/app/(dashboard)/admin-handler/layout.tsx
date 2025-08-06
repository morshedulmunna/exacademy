import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import Footer from "@/components/Footer";
import Header from "@/components/Navbar/Header";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminHandlerlayout({ children }: Props) {
  return (
    <>
      <div className="flex h-screen ">
        <div className="w-screen h-screen bg-black fixed top-0 opacity-60 -z-10"></div>
        <div className="w-72 border-r border-gray-900 p-4">sidebar</div>
        <div className="flex-1 p-4">
          <div className="border w-full p-2 px-4 rounded-full border-gray-900 ">Topbar</div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
