"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Facebook, MessageSquare, User, LogOut, Settings, Menu, X, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Discord from "@/assets/svg/Discord";
import Youtube from "@/assets/svg/Youtube";
import Linkedin from "@/assets/svg/Linkedin";
import Github from "@/assets/svg/Github";

type Props = {};

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: null, target: "_self" },
  { href: "/blog", label: "Blogs", icon: null, target: "_self" },
  { href: "/#about", label: "About", icon: null, target: "_self" },
  { href: "/#contact", label: "Contact", icon: null, target: "_self" },
] as const;

export default function Header({}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".mobile-menu") && !target.closest(".mobile-menu-button")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setShowUserMenu(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm lg:text-base">M</span>
            </div>
            <span className="text-white font-semibold text-lg lg:text-xl group-hover:text-purple-400 transition-colors duration-300">Morshedul Munna</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_ITEMS.map(({ href, label, icon, target }) => (
              <Link key={href} href={href} target={target} className="text-gray-300 hover:text-white transition-colors duration-300 relative group text-sm font-medium">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group">
                  {session.user?.avatar ? (
                    <Image src={session.user.avatar} alt={session.user.name || "User"} width={32} height={32} className="rounded-full ring-2 ring-transparent group-hover:ring-purple-500 transition-all duration-300" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{session.user?.name || session.user?.username}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-black/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl overflow-hidden">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-white font-medium truncate">{session.user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link href="/profile" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200" onClick={() => setShowUserMenu(false)}>
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200" onClick={() => setShowUserMenu(false)}>
                          <Settings className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <button onClick={handleSignOut} className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/register" className="gradient-bg text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300 mobile-menu-button">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mobile-menu bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-3">
              {NAV_ITEMS.map(({ href, label, icon, target }) => (
                <Link key={href} href={href} target={target} className="block text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium py-2 border-b border-white/5 last:border-b-0" onClick={closeMobileMenu}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-white/10">
              {status === "loading" ? (
                <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    {session.user?.avatar ? (
                      <Image src={session.user.avatar} alt={session.user.name || "User"} width={40} height={40} className="rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{session.user?.name || session.user?.username}</p>
                      <p className="text-gray-400 text-sm">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link href="/profile" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200" onClick={closeMobileMenu}>
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200" onClick={closeMobileMenu}>
                      <Settings className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center space-x-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" className="block w-full text-center text-gray-300 hover:text-white transition-colors duration-300 text-base font-medium py-3 border border-white/20 rounded-lg hover:bg-white/5" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                  <Link href="/register" className="block w-full text-center gradient-bg text-white py-3 rounded-lg te   transition-all duration-300" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
