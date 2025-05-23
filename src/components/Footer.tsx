import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Youtube, Twitter, Linkedin, Github, Check } from "lucide-react";

type Props = {};

export default function Footer({}: Props) {
  return (
    <>
      <footer className="py-10 border-t border-zinc-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/diverse-avatars.png" alt="Morshedul Munna" width={32} height={32} className="rounded-full" />
              <span className="font-medium">Morshedul Munna</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="#about" className="text-sm hover:text-gray-300 transition">
                About
              </Link>
              <Link href="#guest-book" className="text-sm hover:text-gray-300 transition">
                Guest Book
              </Link>
              <Link href="#discord" className="text-sm hover:text-gray-300 transition">
                Discord
              </Link>
              <Link href="#cohort" className="text-sm hover:text-gray-300 transition">
                Cohort
              </Link>
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="https://youtube.com" aria-label="YouTube">
                <Youtube className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
              <Link href="https://github.com" aria-label="GitHub">
                <Github className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
