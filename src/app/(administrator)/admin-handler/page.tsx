import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { DashboardHeader, StatsGrid, QuickActionsGrid } from "../_@components";

/**
 * Admin Dashboard Page
 * Only accessible to users with ADMIN role
 */
export default async function AdminDashboard() {
  const user = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch admin statistics
  const [totalPosts, publishedPosts, draftPosts, totalUsers, totalTags] = await Promise.all([prisma.post.count(), prisma.post.count({ where: { published: true } }), prisma.post.count({ where: { published: false } }), prisma.user.count(), prisma.tag.count()]);

  return (
    <div className="py-8">
      <div className=" px-4 sm:px-6 lg:px-8">
        <DashboardHeader />
        <StatsGrid totalPosts={totalPosts} publishedPosts={publishedPosts} draftPosts={draftPosts} totalUsers={totalUsers} />
        <QuickActionsGrid />
      </div>
    </div>
  );
}
