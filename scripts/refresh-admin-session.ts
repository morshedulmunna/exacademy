import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Script to refresh admin role and force session update
 * This will update the user's role and force them to re-authenticate
 */
async function refreshAdminSession(email: string) {
  try {
    // First, let's check the current user
    const currentUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!currentUser) {
      console.error(`❌ User with email ${email} not found`);
      return;
    }

    console.log(`📋 Current user: ${currentUser.name} (${currentUser.email})`);
    console.log(`📋 Current role: ${currentUser.role}`);

    // Update the role to ADMIN (even if it's already ADMIN to force a change)
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        updatedAt: new Date(), // Force update timestamp
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    console.log(`✅ Successfully updated ${updatedUser.name} (${updatedUser.email})`);
    console.log(`✅ New role: ${updatedUser.role}`);
    console.log(`✅ Updated at: ${updatedUser.updatedAt}`);

    // Delete all sessions for this user to force re-authentication
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId: updatedUser.id },
    });

    console.log(`🗑️ Deleted ${deletedSessions.count} sessions for user`);
    console.log(`🔄 User will need to log in again to get fresh session`);

    return updatedUser;
  } catch (error) {
    console.error("❌ Error refreshing admin session:", error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.log("Usage: npx tsx scripts/refresh-admin-session.ts <email>");
    console.log("Example: npx tsx scripts/refresh-admin-session.ts morshedulmunna1@gmail.com");
    return;
  }

  await refreshAdminSession(email);
}

main()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
