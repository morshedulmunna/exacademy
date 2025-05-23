import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MessageSquare } from "lucide-react";
import Discord from "@/assets/svg/Discord";
import Youtube from "@/assets/svg/Youtube";

type Props = {};

const NAV_ITEMS = [
  { href: "/about", label: "About", icon: null, target: "_self" },
  { href: "https://www.youtube.com/@morshedulmunna1", label: "Youtube", icon: <Youtube />, target: "_blank" },
  { href: "/contact", label: "Contact", icon: null, target: "_self" },
] as const;

export default function Header({}: Props) {
  return (
    <header className="container mx-auto py-4 hidden md:block">
      <nav className="flex items-center justify-center bg-zinc-900/80 rounded-full px-8 py-2 backdrop-blur-sm max-w-fit mx-auto">
        <div className="flex items-center gap-2 mr-12">
          <Image src="/diverse-avatars.png" alt="Morshedul Munna" width={32} height={32} className="rounded-full" />
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
