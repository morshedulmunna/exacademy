import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { AdminHeader, AdminNavigation } from "./_@components";

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
    <div className="min-h-screen transition-colors duration-200">
      <AdminHeader userName={user.name || "Admin"} />
      <AdminNavigation />
      <main className="transition-colors duration-200">{children}</main>
    </div>
  );
}
