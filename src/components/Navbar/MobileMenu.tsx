"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/themes/ThemeProvider";
import ThemeToggler from "@/themes/ThemeToggler";
import { NAV_ITEMS } from "./constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile menu component with navigation and authentication options
 */
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`lg:hidden mobile-menu backdrop-blur-md border-t ${
      theme === "dark" ? "bg-black/95 border-white/10" : "bg-white/95 border-gray-200/50"
    }`}>
      <div className="px-4 py-6 space-y-4">
        {/* Mobile Navigation */}
        <nav className="space-y-3">
          {NAV_ITEMS.map(({ href, label, icon, target }) => (
            <Link
              key={href}
              href={href}
              target={target}
              className={`block transition-colors duration-300 text-base font-medium py-2 border-b last:border-b-0 ${
                theme === "dark" ? "text-gray-300 hover:text-white border-white/5" : "text-gray-600 hover:text-gray-900 border-gray-200/50"
              }`}
              onClick={onClose}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile Auth Section */}
        <div className={`pt-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Theme</span>
            <ThemeToggler />
          </div>
          
          {status === "loading" ? (
            <div className={`w-8 h-8 rounded-full animate-pulse ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}></div>
          ) : session ? (
            <div className="space-y-3">
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                theme === "dark" ? "bg-white/5" : "bg-gray-50"
              }`}>
                {session.user?.avatar ? (
                  <Image 
                    src={session.user.avatar} 
                    alt={session.user.name || "User"} 
                    width={40} 
                    height={40} 
                    className="rounded-full" 
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {session.user?.name || session.user?.username}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <Settings className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                    theme === "dark" ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : "text-red-600 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                className={`block w-full text-center transition-colors duration-300 text-base font-medium py-3 border rounded-lg ${
                  theme === "dark" ? "text-gray-300 hover:text-white border-white/20 hover:bg-white/5" : "text-gray-600 hover:text-gray-900 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={onClose}
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="block w-full text-center gradient-bg text-white py-3 rounded-lg transition-all duration-300" 
                onClick={onClose}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 