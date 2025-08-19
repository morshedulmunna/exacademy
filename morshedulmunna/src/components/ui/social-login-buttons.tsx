"use client";
import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";
import { useTheme } from "@/themes/ThemeProvider";

interface SocialLoginButtonsProps {
  isLoading?: boolean;
}

export default function SocialLoginButtons({ isLoading = false }: SocialLoginButtonsProps) {
  const { theme } = useTheme();

  const handleGoogleSignIn = () => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9090";
    const url = new URL("/api/v1/auth/google/login", base);
    url.searchParams.set("redirect", currentPath);
    // Use full-page redirect to backend
    window.location.href = url.toString();
  };

  const handleGitHubSignIn = () => {};

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
