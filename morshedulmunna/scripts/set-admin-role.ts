import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Script to set admin role for a user
 * Usage: npx tsx scripts/set-admin-role.ts <email>
 */
async function setAdminRole(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`✅ Successfully set ${user.name} (${user.email}) as ADMIN`);
    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      console.error(`❌ User with email ${email} not found`);
    } else {
      console.error("❌ Error updating user:", error);
    }
    throw error;
  }
}

/**
 * Script to list all users with their roles
 */
async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("\n📋 All Users:");
    console.log("─".repeat(80));
    users.forEach((user) => {
      const roleBadge = user.role === "ADMIN" ? "🔴 ADMIN" : "🟢 USER";
      console.log(`${roleBadge} | ${user.name} (${user.email}) | @${user.username} | ${user.createdAt.toLocaleDateString()}`);
    });
    console.log("─".repeat(80));
    console.log(`Total users: ${users.length}`);
    console.log(`Admins: ${users.filter((u) => u.role === "ADMIN").length}`);
    console.log(`Regular users: ${users.filter((u) => u.role === "USER").length}`);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "list") {
    await listUsers();
  } else if (command === "set-admin" && args[1]) {
    await setAdminRole(args[1]);
  } else {
    console.log("Usage:");
    console.log("  npx tsx scripts/set-admin-role.ts list                    # List all users");
    console.log("  npx tsx scripts/set-admin-role.ts set-admin <email>       # Set user as admin");
    console.log("");
    console.log("Examples:");
    console.log("  npx tsx scripts/set-admin-role.ts list");
    console.log("  npx tsx scripts/set-admin-role.ts set-admin admin@example.com");
  }
}

main()
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
