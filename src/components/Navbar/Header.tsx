"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import Discord from "@/assets/svg/Discord";
import Youtube from "@/assets/svg/Youtube";

type Props = {};

const NAV_ITEMS = [
  { href: "/about", label: "About", icon: null, target: "_self" },
  { href: "https://www.youtube.com/@morshedulmunna1", label: "Youtube", icon: <Youtube />, target: "_blank" },
  { href: "/blogs", label: "Blogs", icon: null, target: "_self" },
  { href: "/courses", label: "Courses", icon: null, target: "_self" },
  { href: "/learn-dsa-algorithms", label: "DSA & Algorithms", icon: null, target: "_self" },
  { href: "/contact", label: "Contact", icon: null, target: "_self" },
] as const;

export default function Header({}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 hidden md:block transition-all duration-300 ${isScrolled ? "bg-zinc-900/80 backdrop-blur-sm" : ""}`}>
      <nav
        className={`flex items-center justify-center ${isScrolled ? "w-full" : "max-w-fit mx-auto"} rounded-full px-8 py-2 ${
          isScrolled ? "bg-transparent" : "bg-zinc-900/80 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center gap-2 mr-12">
          {/* <Image src="/diverse-avatars.png" alt="Morshedul Munna" width={32} height={32} className="rounded-full" /> */}
          <span className="font-medium">Morshedul Munna</span>
        </div>
        <div className="flex items-center gap-12">
          {NAV_ITEMS.map(({ href, label, icon, target }) => (
            <Link key={href} href={href} target={target} className="text-sm cursor-pointer hover:text-blue-500 transition flex items-center">
              <span className="mr-1">{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
