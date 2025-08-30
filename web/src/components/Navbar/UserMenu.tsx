"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { User, Settings, ChevronDown, Settings2, Shield, FileText, LogOut } from "lucide-react";
import { useTheme } from "@/themes/ThemeProvider";
import { useOutsideClick, useGetUserInfo } from "@/hooks";
import { removeLocalStorageItem } from "@/lib/utils";
import { logoutAction } from "@/actions/auth/logout";

/**
 * User menu component with dropdown for authenticated users
 */

export default function UserMenu() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading, error, clearUser } = useGetUserInfo();
  const { theme } = useTheme();

  // Ref for user dropdown menu
  const userMenuRef = useOutsideClick(() => setShowUserMenu(false));

  const handleSignOut = async () => {
    try {
      await logoutAction();
    } catch {}
    if (typeof window !== "undefined") {
      try {
        // Clear any client-side cache/state
        removeLocalStorageItem("user");
        removeLocalStorageItem("access_token");
        removeLocalStorageItem("refresh_token");
        // Clear non-HttpOnly cookies that might exist
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
          if (!name) continue;
          document.cookie = `${name}=; Max-Age=0; path=/`;
        }
      } catch {}
      clearUser();
      setShowUserMenu(false);
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    console.error("User data error:", error);
  }

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
              {user.role !== "user" && (
                <>
                  <div className={`px-3 py-1 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>ADMIN</div>
                  <Link
                    href={`/admin`}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link
                    href="/admin/courses"
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Manage Course</span>
                  </Link>
                  <div className={`mx-3 my-1 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}></div>
                </>
              )}

              {user.role === "user" && (
                <Link
                  href={`/learner?username=${encodeURIComponent(user?.username ?? "")}`}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>My Courses</span>
                </Link>
              )}
              <Link
                href={`/${user?.username}/settings/account`}
                className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                onClick={() => setShowUserMenu(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                href={`/${user?.username}/settings/account`}
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
