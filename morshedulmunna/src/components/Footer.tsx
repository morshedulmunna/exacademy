import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Youtube, Twitter, Linkedin, Github, Check } from "lucide-react";

type Props = {};

export default function Footer({}: Props) {
  return (
    <>
      <footer className="py-10 border-t border-zinc-200 dark:border-zinc-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              {/* <Image src="/diverse-avatars.png" alt="Morshedul Munna" width={32} height={32} className="rounded-full" /> */}
              <span className="font-medium">Morshedul Munna</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/contact" className="text-sm hover:text-gray-300 transition">
                Contact
              </Link>
              <Link href="/privacy-policy" className="text-sm hover:text-gray-300 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm hover:text-gray-300 transition">
                Terms
              </Link>
              <Link href="https://discord.gg/gkjQHgcD" className="text-sm hover:text-gray-300 transition">
                Discord
              </Link>

              <Link href="https://www.youtube.com/@morshedulmunna1" className="text-sm hover:text-gray-300 transition">
                Youtube
              </Link>
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <Link target="_blank" href="https://www.youtube.com/@morshedulmunna1" aria-label="YouTube">
                <Youtube className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
              <Link target="_blank" href="https://x.com/morshedulmunna" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
              <Link target="_blank" href="https://www.linkedin.com/in/morshedulmunna" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
              <Link target="_blank" href="https://github.com/morshedulmunna" aria-label="GitHub">
                <Github className="w-5 h-5 text-gray-500 hover:text-white transition" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
