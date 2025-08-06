"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Facebook, MessageSquare, User, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Discord from "@/assets/svg/Discord";
import Youtube from "@/assets/svg/Youtube";
import Linkedin from "@/assets/svg/Linkedin";
import Github from "@/assets/svg/Github";

type Props = {};

const NAV_ITEMS = [{ href: "/blog", label: "Blogs", icon: null, target: "_self" }] as const;

export default function Header({}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 hidden md:block transition-all duration-300 ${isScrolled ? "bg-zinc-900/80 backdrop-blur-sm" : ""}`}>
      <nav className={`flex items-center justify-center ${isScrolled ? "w-full" : "max-w-fit mx-auto"} rounded-full px-8 py-2 ${isScrolled ? "bg-transparent" : "bg-zinc-900/80 backdrop-blur-sm"}`}>
        <div className="flex items-center gap-2 mr-12">
          <span className="font-medium">Morshedul Munna</span>
        </div>
        <div className="flex items-center gap-12">
          {NAV_ITEMS.map(({ href, label, icon, target }) => (
            <Link key={href} href={href} target={target} className="text-sm cursor-pointer hover:text-blue-500 transition flex items-center">
              <span className="mr-1">{icon}</span>
              {label}
            </Link>
          ))}

          {/* Authentication Section */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-500 transition">
                  {session.user?.avatar ? (
                    <Image src={session.user.avatar} alt={session.user.name || "User"} width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span>{session.user?.name || session.user?.username}</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl">
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                        <Settings className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm cursor-pointer hover:text-blue-500 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="text-sm cursor-pointer relative px-4 py-1 rounded-md border border-gray-700 hover:text-blue-500 transition-all duration-300 flex items-center group">
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 rounded-md border-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
