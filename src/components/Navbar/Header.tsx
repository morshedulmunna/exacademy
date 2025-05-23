import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

export default function Header({}: Props) {
  return (
    <>
      <header className="container mx-auto py-4 hidden md:block">
        <nav className="flex items-center justify-center bg-zinc-900/80 rounded-full px-8 py-2 backdrop-blur-sm max-w-fit mx-auto">
          <div className="flex items-center gap-2 mr-12">
            <Image src="/diverse-avatars.png" alt="Morshedul Munna" width={32} height={32} className="rounded-full" />
            <span className="font-medium">Morshedul Munna</span>
          </div>
          <div className="flex items-center gap-12">
            <Link href="#about" className="text-sm cursor-pointer hover:text-gray-300 transition">
              About
            </Link>
            <Link href="#guest-book" className="text-sm cursor-pointer hover:text-gray-300 transition">
              Guest Book
            </Link>
            <Link href="#discord" className="text-sm cursor-pointer hover:text-gray-300 transition">
              Discord
            </Link>
            <Link href="#cohort" className="text-sm cursor-pointer hover:text-gray-300 transition">
              Cohort
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
