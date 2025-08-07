import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { AdminSidebar, AdminTopBar } from "./_@components";

type Props = {
  children: React.ReactNode;
};

export default async function AdministratorLayout({ children }: Props) {
  const user = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <AdminTopBar userName={user.name || "Admin"} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
