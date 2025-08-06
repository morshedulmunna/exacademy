import { getCurrentUser } from "@/lib/auth-utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DebugAuthPage() {
  const user = await getCurrentUser();
  const session = await getServerSession(authOptions);

  // Get direct database user info
  const dbUser = user?.email
    ? await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          username: true,
          updatedAt: true,
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Debug</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User (getCurrentUser)</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session (getServerSession)</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(session, null, 2)}</pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Database User (Direct Query)</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(dbUser, null, 2)}</pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Access Test</h2>
          <div className="space-y-2">
            <p>
              <strong>Is Authenticated:</strong> {user ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Session Role:</strong> {user?.role || "Not set"}
            </p>
            <p>
              <strong>Database Role:</strong> {dbUser?.role || "Not found"}
            </p>
            <p>
              <strong>Roles Match:</strong> {user?.role === dbUser?.role ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Is Admin:</strong> {user?.role === "ADMIN" ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Can Access Admin Route:</strong> {user?.role === "ADMIN" ? "✅ Yes" : "❌ No"}
            </p>
          </div>

          {user?.role === "ADMIN" ? (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">✅ You should be able to access admin routes!</p>
              <a href="/admin-handler" className="text-green-600 hover:text-green-800 underline">
                Try accessing admin panel →
              </a>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800">❌ You cannot access admin routes.</p>
              <p className="text-red-700 mt-2">
                <strong>Session Role:</strong> {user?.role || "Not set"}
                <br />
                <strong>Database Role:</strong> {dbUser?.role || "Not found"}
              </p>
              {user?.role !== dbUser?.role && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800">⚠️ Session and database roles don't match!</p>
                  <p className="text-yellow-700 text-sm">This indicates a session caching issue.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
