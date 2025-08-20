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
      <MaxWidthWrapper className="h-screen">
        <div className="flex flex-col h-full">
          <Header />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
