"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleOAuthPage() {
  const router = useRouter();
  const initializedRef = useRef(false);
  const [isScriptLoading, setIsScriptLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      router.push("/login?error=google_not_configured");
      return;
    }

    const initializeAndRender = () => {
      try {
        window.google?.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            const id_token = response?.credential;
            if (!id_token) return;
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_token }),
              });
              if (res.ok) {
                try {
                  const json = await res.json();
                  const user = (json as any)?.data?.user;
                  if (user) {
                    const minimalUser = {
                      id: user.id,
                      email: user.email,
                      username: user.username ?? null,
                      name: user.full_name ?? user.first_name ?? null,
                      role: user.role ?? null,
                      avatar: user.avatar_url ?? null,
                    };
                    localStorage.setItem("user", JSON.stringify({ user: minimalUser }));
                  }
                } catch {}
                router.push("/");
                router.refresh();
              } else {
                router.push("/login?error=google_login_failed");
              }
            } catch {
              router.push("/login?error=google_login_failed");
            }
          },
          auto_select: false,
        });

        const container = document.getElementById("gsi-button");
        if (container) {
          container.innerHTML = "";
          window.google?.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: 320,
            type: "standard",
            text: "signin_with",
            shape: "rectangular",
          });
        }
        setIsScriptLoading(false);
      } catch (e) {
        console.error("Failed to initialize Google Identity Services", e);
        setInitError("Failed to initialize Google sign-in. Please try again.");
        setIsScriptLoading(false);
      }
    };

    if (typeof window !== "undefined" && (window as any).google) {
      initializeAndRender();
      return;
    }

    const existing = document.getElementById("google-gsi");
    if (existing) {
      // If script already exists but window.google not ready yet, wait for load
      existing.addEventListener("load", initializeAndRender, { once: true });
      return () => existing.removeEventListener("load", initializeAndRender as any);
    }

    const script = document.createElement("script");
    script.id = "google-gsi";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeAndRender;
    document.body.appendChild(script);

    return () => {
      try {
        const s = document.getElementById("google-gsi");
        if (s && s.parentNode) s.parentNode.removeChild(s);
        const container = document.getElementById("gsi-button");
        if (container) container.innerHTML = "";
      } catch {}
    };
  }, [router]);

  return (
    <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <div className="relative overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-900 shadow-sm">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.12]" style={{ background: "radial-gradient(600px circle at 0% 0%, #3b82f6, transparent 40%), radial-gradient(800px circle at 100% 100%, #22c55e, transparent 40%)" }} />

        <div className="relative">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Continue with Google</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Choose your Google account to continue</p>
          </div>

          {initError ? (
            <div className="mb-4 rounded-md border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-red-700 dark:text-red-300 text-sm" role="alert">
              {initError}
            </div>
          ) : null}

          <div className="flex flex-col items-center gap-4">
            <div id="gsi-button" className="flex justify-center" aria-label="Google Sign-In button" aria-busy={isScriptLoading} />

            {isScriptLoading && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm" aria-live="polite">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-600" />
                Preparing secure sign-in…
              </div>
            )}

            <div className="w-full mt-2 space-y-3">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">How it works</h2>
                <ol className="mt-2 space-y-1 list-decimal list-inside text-gray-600 dark:text-gray-300 text-sm">
                  <li>Click “Sign in with Google”.</li>
                  <li>Select your Google account.</li>
                  <li>We verify your identity and sign you in securely.</li>
                </ol>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">What we access</h2>
                <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Your name</li>
                  <li>• Email address</li>
                  <li>• Profile photo (avatar)</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">We never receive your Google password.</p>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-zinc-900/40 p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Troubleshooting</h2>
                <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                  <li>• Disable ad/script blockers and try again.</li>
                  <li>• Ensure third‑party cookies are allowed for Google.</li>
                  <li>• Try another browser or an incognito window.</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Need help?{" "}
                  <Link href="/contact" className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-300">
                    Contact support
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-300">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-300">
                Privacy Policy
              </Link>
              .
            </div>

            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
