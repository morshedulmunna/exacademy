import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fix authentication redirect and ensure proper OAuth flow
 */
async function fixAuthRedirect(email: string) {
  try {
    console.log(`🔧 Fixing authentication for: ${email}`);

    // Step 1: Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      return;
    }

    console.log(`📋 Found user: ${user.name} (${user.email})`);
    console.log(`📋 Current role: ${user.role}`);

    // Step 2: Check if user has any accounts
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
      },
    });

    console.log(`📋 Found ${accounts.length} OAuth accounts`);

    if (accounts.length === 0) {
      console.log(`⚠️  No OAuth accounts found. User will need to re-authenticate with Google.`);
    }

    // Step 3: Check if user has any sessions
    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        sessionToken: true,
        expires: true,
      },
    });

    console.log(`📋 Found ${sessions.length} active sessions`);

    // Step 4: Ensure user role is ADMIN
    if (user.role !== "ADMIN") {
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
    } else {
      console.log(`✅ User already has ADMIN role`);
    }

    console.log(`\n🔧 AUTHENTICATION FIX COMPLETE!`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Clear browser cache and cookies for this site`);
    console.log(`   2. Go to /login page`);
    console.log(`   3. Click "Sign in with Google"`);
    console.log(`   4. Complete the OAuth flow`);
    console.log(`   5. You should be redirected to the home page with ADMIN access`);

    return user;
  } catch (error) {
    console.error("❌ Error fixing authentication:", error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.log("Usage: npx tsx scripts/fix-auth-redirect.ts <email>");
    console.log("Example: npx tsx scripts/fix-auth-redirect.ts morshedulmunna1@gmail.com");
    return;
  }

  await fixAuthRedirect(email);
}

main()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
