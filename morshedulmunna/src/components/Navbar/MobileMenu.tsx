"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { User, LogOut, Settings, ChevronDown, BookOpen, Code, Palette, Database, Globe } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/themes/ThemeProvider";
import ThemeToggler from "@/themes/ThemeToggler";
import { NAV_ITEMS } from "./constants";
import SearchBar from "./SearchBar";

/**
 * Category options with icons and descriptions
 */
const CATEGORIES = [
  { id: "web-development", label: "Web Development", icon: Code, href: "/course?category=web-development", description: "HTML, CSS, JavaScript, React" },
  { id: "programming", label: "Programming", icon: Code, href: "/course?category=programming", description: "Python, Java, C++, Go" },
  { id: "design", label: "Design", icon: Palette, href: "/course?category=design", description: "UI/UX, Figma, Adobe Creative Suite" },
  { id: "data-science", label: "Data Science", icon: Database, href: "/course?category=data-science", description: "Machine Learning, AI, Analytics" },
  { id: "business", label: "Business", icon: BookOpen, href: "/course?category=business", description: "Marketing, Finance, Management" },
  { id: "languages", label: "Languages", icon: Globe, href: "/course?category=languages", description: "English, Spanish, French" },
] as const;

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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`md:hidden mobile-menu backdrop-blur-md border-t ${theme === "dark" ? "bg-black/95 border-white/10" : "bg-white/95 border-gray-200/50"}`}>
      <div className="px-4 py-6 space-y-4">
        {/* Mobile Search Bar */}
        <div className="mb-4">
          <SearchBar />
        </div>

        {/* Mobile Category Dropdown */}
        <div className="mb-4">
          <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            <span className="font-medium">Categories</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
          </button>

          {isCategoryOpen && (
            <div className={`mt-2 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              {CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    href={category.href}
                    onClick={() => {
                      setIsCategoryOpen(false);
                      onClose();
                    }}
                    className={`flex items-center space-x-3 p-3 border-b last:border-b-0 transition-all duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-200"}`}
                  >
                    <IconComponent className="w-5 h-5 text-purple-500" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{category.label}</div>
                      <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{category.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <nav className="space-y-3">
          {NAV_ITEMS.map(({ href, label, icon, target }) => (
            <Link
              key={href}
              href={href}
              target={target}
              className={`block transition-colors duration-300 text-base font-medium py-2 border-b last:border-b-0 ${theme === "dark" ? "text-gray-300 hover:text-white border-white/5" : "text-gray-600 hover:text-gray-900 border-gray-200/50"}`}
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
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-50"}`}>
                {session.user?.avatar ? (
                  <Image src={session.user.avatar} alt={session.user.name || "User"} width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{session.user?.name || session.user?.username}</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{session.user?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/profile" className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`} onClick={onClose}>
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                  onClick={onClose}
                >
                  <Settings className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleSignOut} className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors duration-200 ${theme === "dark" ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : "text-red-600 hover:text-red-700 hover:bg-red-50"}`}>
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
              <Link href="/register" className="block w-full text-center gradient-bg text-white py-3 rounded-lg transition-all duration-300" onClick={onClose}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
