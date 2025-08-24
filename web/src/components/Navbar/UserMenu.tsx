"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { User, Settings, ChevronDown, Settings2, Shield, FileText, LogOut } from "lucide-react";
import { useTheme } from "@/themes/ThemeProvider";
import { useOutsideClick } from "@/hooks/useOutsideClick";

/**
 * User menu component with dropdown for authenticated users
 */
type MinimalUser = {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  role?: string | null;
  avatar?: string | null;
};

export default function UserMenu() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<MinimalUser | null>(null);
  const { theme } = useTheme();

  // Ref for user dropdown menu
  const userMenuRef = useOutsideClick(() => setShowUserMenu(false));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // Read from localStorage only: structure { user: MinimalUser }
      const ls = localStorage.getItem("user");
      if (ls) {
        try {
          const parsed = JSON.parse(ls);
          if (parsed && parsed.user) {
            setUser(parsed.user as MinimalUser);
            return;
          }
        } catch {}
      }
      setUser(null);
    } catch {
      setUser(null);
    }
  }, []);

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      try {
        // Clear localStorage user info only
        localStorage.removeItem("user");
      } catch {}
    }
    setShowUserMenu(false);
    // Soft refresh to update UI state
    if (typeof window !== "undefined") window.location.reload();
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Link href="/login" className={`transition-colors duration-300 text-sm font-medium ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
          Sign In
        </Link>
        <Link href="/register" className="gradient-bg text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={userMenuRef}>
      <button onClick={() => setShowUserMenu(!showUserMenu)} className={`flex items-center space-x-2 transition-colors duration-300 group ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
        {user?.avatar ? (
          <Image src={user.avatar} alt={user.name || user.username || "User"} width={32} height={32} className="rounded-full ring-2 ring-transparent group-hover:ring-purple-500 transition-all duration-300" />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-sm font-medium">{user.name || user.username}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} />
      </button>

      {/* User Dropdown Menu */}
      {showUserMenu && (
        <div className={`absolute right-0 top-full mt-2 w-56 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden ${theme === "dark" ? "bg-black/95 border border-white/20" : "bg-white/95 border border-gray-200/50"}`}>
          <div className="p-2">
            <div className={`px-3 py-2 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Signed in as</p>
              <p className={`font-medium truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{user.email}</p>
            </div>
            <div className="py-2">
              {/* Admin Links */}
              {user.role === "admin" && (
                <>
                  <div className={`px-3 py-1 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>ADMIN</div>
                  <Link
                    href="/admin-handler"
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link
                    href="/admin-handler/posts"
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Manage Posts</span>
                  </Link>
                  <div className={`mx-3 my-1 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}></div>
                </>
              )}

              <Link
                href="/dashboard/my-courses"
                className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="w-4 h-4" />
                <span>My Courses</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                onClick={() => setShowUserMenu(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                onClick={() => setShowUserMenu(false)}
              >
                <Settings2 className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : "text-red-600 hover:text-red-700 hover:bg-red-50"}`}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
