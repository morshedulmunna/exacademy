import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Nuclear reset - completely clear all authentication data for a user
 * This will force them to start completely fresh
 */
async function nuclearReset(email: string) {
  try {
    console.log(`🚀 Starting nuclear reset for: ${email}`);

    // Step 1: Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      return;
    }

    console.log(`📋 Found user: ${user.name} (${user.email})`);
    console.log(`📋 Current role: ${user.role}`);

    // Step 2: Delete ALL sessions for this user
    const deletedSessions = await prisma.session.deleteMany({
      where: { userId: user.id },
    });
    console.log(`🗑️ Deleted ${deletedSessions.count} sessions`);

    // Step 3: Delete ALL accounts for this user
    const deletedAccounts = await prisma.account.deleteMany({
      where: { userId: user.id },
    });
    console.log(`🗑️ Deleted ${deletedAccounts.count} OAuth accounts`);

    // Step 4: Update user role to ADMIN and force timestamp update
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
    console.log(`✅ Updated timestamp: ${updatedUser.updatedAt}`);

    // Step 5: Verify the update
    const verificationUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    console.log(`\n🔍 Verification:`);
    console.log(`   User: ${verificationUser?.name}`);
    console.log(`   Email: ${verificationUser?.email}`);
    console.log(`   Role: ${verificationUser?.role}`);
    console.log(`   Updated: ${verificationUser?.updatedAt}`);

    console.log(`\n🎯 NUCLEAR RESET COMPLETE!`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Clear ALL browser data for this site (cookies, cache, storage)`);
    console.log(`   2. Restart your browser completely`);
    console.log(`   3. Go to your site and log in with: ${email}`);
    console.log(`   4. You should now have a completely fresh session with ADMIN role`);

    return updatedUser;
  } catch (error) {
    console.error("❌ Error during nuclear reset:", error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.log("Usage: npx tsx scripts/nuclear-reset.ts <email>");
    console.log("Example: npx tsx scripts/nuclear-reset.ts morshedulmunna1@gmail.com");
    console.log("\n⚠️  WARNING: This will completely clear all authentication data!");
    return;
  }

  await nuclearReset(email);
}

main()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
