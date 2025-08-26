"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GithubCallbackForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code) {
      router.replace("/login?error=missing_code");
      return;
    }
    // Optional: validate state
    const expectedState = sessionStorage.getItem("github_oauth_state");
    if (expectedState && state && expectedState !== state) {
      router.replace("/login?error=invalid_state");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (res.ok) {
          try {
            const user = (data as any)?.data?.user;
            if (user) {
              const minimalUser = {
                id: user.id,
                email: user.email,
                username: user.username ?? null,
                name: user.name ?? null,
                role: user.role ?? null,
                avatar: user.avatar ?? null,
              };
              localStorage.setItem("user", JSON.stringify({ user: minimalUser }));
            }
          } catch {}
          router.replace("/");
          router.refresh();
        } else {
          router.replace("/login?error=github_login_failed");
        }
      } catch (e) {
        router.replace("/login?error=github_login_failed");
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-900 shadow-sm">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Signing you in…</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Completing GitHub login</p>
        </div>
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-900 shadow-sm">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Initializing GitHub login</p>
            </div>
          </div>
        </div>
      }
    >
      <GithubCallbackForm />
    </Suspense>
  );
}
