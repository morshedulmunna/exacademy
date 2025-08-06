"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";

interface SocialLoginButtonsProps {
  isLoading?: boolean;
}

export default function SocialLoginButtons({ isLoading = false }: SocialLoginButtonsProps) {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/" });
  };

  return (
    <div className="space-y-3 mt-12">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black rounded-md px-4 py-1 text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300">
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>

        <Button type="button" variant="outline" onClick={handleGitHubSignIn} disabled={isLoading} className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
