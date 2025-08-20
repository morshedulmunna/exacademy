import React from "react";
import { AdminSidebar, AdminTopBar, SidebarProvider } from "./_@components";

type Props = {
  children: React.ReactNode;
};

export default async function AdministratorLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Fixed Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <AdminTopBar userName={"Admin"} />
        </div>

        {/* Fixed Sidebar */}
        <div className="fixed top-16 left-0 h-full z-40">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div className="pt-16 pl-64 transition-all duration-300" id="main-content">
          <main className="p-6 transition-colors duration-200">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
