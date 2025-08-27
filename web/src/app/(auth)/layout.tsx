import Header from "@/components/Navbar/Header";
import Footer from "@/components/Footer";
import React from "react";

type Props = {
  children: React.ReactNode;
};

/**
 * Auth layout that provides a clean, centered container for authentication pages
 * with header and footer while maintaining proper height and width
 */
export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center relative px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
