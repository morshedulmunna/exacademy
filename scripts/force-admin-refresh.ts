import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Force refresh admin session by clearing all sessions and accounts
 * This will force the user to completely re-authenticate
 */
async function forceAdminRefresh(email: string) {
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

    // Step 1: Update the role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    console.log(`✅ Updated user role to: ${updatedUser.role}`);

    // Step 2: Delete ALL sessions for this user
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId: updatedUser.id },
    });
    console.log(`🗑️ Deleted ${deletedSessions.count} sessions`);

    // Step 3: Delete ALL accounts for this user (this will force re-authentication)
    const deletedAccounts = await prisma.account.deleteMany({
      where: { userId: updatedUser.id },
    });
    console.log(`🗑️ Deleted ${deletedAccounts.count} OAuth accounts`);

    console.log(`\n🔄 COMPLETE SESSION REFRESH COMPLETE`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Log out of your current session`);
    console.log(`   2. Clear your browser cookies/cache for this site`);
    console.log(`   3. Log in again with: ${email}`);
    console.log(`   4. You should now have ADMIN role in your session`);

    return updatedUser;
  } catch (error) {
    console.error("❌ Error forcing admin refresh:", error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.log("Usage: npx tsx scripts/force-admin-refresh.ts <email>");
    console.log("Example: npx tsx scripts/force-admin-refresh.ts morshedulmunna1@gmail.com");
    return;
  }

  await forceAdminRefresh(email);
}

main()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
