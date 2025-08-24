"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleOAuthPage() {
  const router = useRouter();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      router.push("/login?error=google_not_configured");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
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

        // Render the Google button
        const container = document.getElementById("gsi-button");
        if (container) {
          window.google?.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: 320,
            type: "standard",
            text: "signin_with",
            shape: "rectangular",
          });
        }
      } catch (e) {
        console.error("Failed to initialize Google Identity Services", e);
      }
    };
    document.body.appendChild(script);
  }, [router]);

  return (
    <div className="w-full mt-24 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-900 shadow-sm">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Continue with Google</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Choose your Google account to continue</p>
        </div>
        <div id="gsi-button" className="flex justify-center" />
      </div>
    </div>
  );
}
