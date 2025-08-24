"use client";
import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";
import { useTheme } from "@/themes/ThemeProvider";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface SocialLoginButtonsProps {
  isLoading?: boolean;
}

export default function SocialLoginButtons({ isLoading = false }: SocialLoginButtonsProps) {
  const { theme } = useTheme();
  const router = useRouter();

  // Google One-Tap or popup flow: expect global google accounts api if loaded.
  const handleGoogleSignIn = useCallback(async () => {
    try {
      // If using Google Identity Services, obtain ID token from the credential response.
      // Fallback: check for URL param `credential` placed by Google One Tap
      const url = new URL(window.location.href);
      const oneTapToken = url.searchParams.get("credential");
      let idToken: string | null = oneTapToken;

      // If not using One Tap, you can integrate the button flow and set idToken here.
      if (!idToken) {
        // TODO: integrate Google Identity Services button/popup if needed.
        // For now, try to read from any global callback stash.
        // You may replace this with your preferred Google client flow.
      }

      if (!idToken) {
        // As a convenience, navigate to a dedicated /oauth/google page if implemented
        router.push("/oauth/google");
        return;
      }

      // Submit to our server action via fetch since this is a client component
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
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
        // After successful login, reload to pick up cookies
        router.push("/");
        router.refresh();
      } else {
        console.error("Google login failed", data);
      }
    } catch (e) {
      console.error("Google login error", e);
    }
  }, [router]);

  const handleGitHubSignIn = useCallback(async () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const redirectUri = `${window.location.origin}/oauth/github/callback`;
      const state = Math.random().toString(36).slice(2);
      const scope = "read:user user:email";

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId || "")}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;

      // Optionally persist state to validate on callback
      sessionStorage.setItem("github_oauth_state", state);
      window.location.href = authUrl;
    } catch (e) {
      console.error("GitHub login error", e);
    }
  }, []);

  return (
    <div className="space-y-3 mt-12">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className={`w-full border-t ${theme === "dark" ? "border-white/20" : "border-gray-300"}`} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className={`rounded-md px-4 py-1 ${theme === "dark" ? "bg-black text-gray-400" : "bg-gray-100 text-gray-600"}`}>Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full transition-all duration-300 ${theme === "dark" ? "bg-white/5 border-white/20 text-white hover:bg-white/20 hover:border-gray-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"}`}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleGitHubSignIn}
          disabled={isLoading}
          className={`w-full transition-all duration-300 ${theme === "dark" ? "bg-white/5 border-white/20 text-white hover:bg-white/20 hover:border-gray-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"}`}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
