import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupOrphanedAccounts() {
  try {
    console.log("Starting cleanup of orphaned accounts...");

    // Get all account IDs
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
      },
    });

    console.log(`Found ${accounts.length} total accounts`);

    // Check each account to see if the user exists
    let orphanedCount = 0;
    for (const account of accounts) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: account.userId },
          select: { id: true },
        });

        if (!user) {
          console.log(`Deleting orphaned account: ${account.id}`);
          await prisma.account.delete({
            where: { id: account.id },
          });
          orphanedCount++;
        }
      } catch (error) {
        console.log(`Error checking account ${account.id}:`, error);
        // If there's an error, the account might be orphaned, so delete it
        try {
          await prisma.account.delete({
            where: { id: account.id },
          });
          orphanedCount++;
        } catch (deleteError) {
          console.error(`Failed to delete account ${account.id}:`, deleteError);
        }
      }
    }

    console.log(`Deleted ${orphanedCount} orphaned accounts`);

    // Clean up orphaned sessions
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        userId: true,
      },
    });

    console.log(`Found ${sessions.length} total sessions`);

    let orphanedSessionCount = 0;
    for (const session of sessions) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: session.userId },
          select: { id: true },
        });

        if (!user) {
          console.log(`Deleting orphaned session: ${session.id}`);
          await prisma.session.delete({
            where: { id: session.id },
          });
          orphanedSessionCount++;
        }
      } catch (error) {
        console.log(`Error checking session ${session.id}:`, error);
        try {
          await prisma.session.delete({
            where: { id: session.id },
          });
          orphanedSessionCount++;
        } catch (deleteError) {
          console.error(`Failed to delete session ${session.id}:`, deleteError);
        }
      }
    }

    console.log(`Deleted ${orphanedSessionCount} orphaned sessions`);
    console.log("Cleanup completed successfully");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedAccounts();
