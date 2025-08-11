import Link from "next/link";
import React from "react";
import { Youtube, Twitter, Linkedin, Github, Check } from "lucide-react";
import { Button } from "./ui/button";
import AnimatedSvg from "@/common/Effect/AnimatedSvg";
import { munna_image } from "@/assets";
import Image from "next/image";

type Props = {};

export default function Hero({}: Props) {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto py-0  md:py-12 sm:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-0 md:gap-10 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Trust me, I'm a <span className="text-cyan-400">software engineer</span>.
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg">
              Meet{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text font-bold animate-gradient-x  relative inline-block after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-cyan-400/20 after:via-purple-500/20 after:to-pink-500/20 after:blur-xl after:-z-10">
                Morshedul Munna
              </span>
              , a passionate software engineer and educator dedicated to sharing knowledge and building innovative solutions. With extensive experience in developing scalable web applications and technical education, I craft engaging content and courses that make tech learning
              fun and accessible.
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-xs sm:text-base hover:font-bold transition-all duration-300 font-medium">— Morshedul Munna</p>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-400">Founder</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Execute Soft</span>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <p className="flex items-center gap-2 text-sm sm:text-base">
                Building <span className="font-semibold">careaar</span>
                <span className="text-gray-400 text-xs">next-gen Job Portal & review platform</span>
                <span className="text-white text-base">✨</span>
              </p>
            </div>

            <Link href="https://discord.gg/gkjQHgcD" target="_blank" className="bg-indigo-600 w-fit hover:bg-indigo-700 text-white flex items-center gap-2 rounded-md text-sm sm:text-base px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-discord">
                <circle cx="9" cy="12" r="1" />
                <circle cx="15" cy="12" r="1" />
                <path d="M8 17a5 5 0 0 1 8 0" />
                <path d="M15.2 9a5 5 0 0 0-6.4 0" />
                <path d="M17.8 5a9 9 0 0 0-11.6 0" />
                <path d="M19 7v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />
              </svg>
              Join Discord
            </Link>
          </div>
          <div className="relative w-full aspect-square  mx-auto order-first rounded-md md:order-last ">
            <Image src={munna_image} alt="Morshedul Munna" className="rounded-full absolute object-cover w-fit h-fit" priority />
            <AnimatedSvg />
          </div>
        </div>

        <div className="flex justify-center md:justify-end gap-4 mt-6">
          <Link href="https://www.youtube.com/@morshedulmunna1" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:scale-110 transition-transform">
            <Youtube className="w-5 h-5 text-gray-500 hover:text-white transition" />
          </Link>
          <Link href="https://x.com/morshedulmunna" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:scale-110 transition-transform">
            <Twitter className="w-5 h-5 text-gray-500 hover:text-white transition" />
          </Link>
          <Link href="https://linkedin.com/in/morshedulmunna/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 transition-transform">
            <Linkedin className="w-5 h-5 text-gray-500 hover:text-white transition" />
          </Link>
          <Link href="https://github.com/morshedulmunna" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:scale-110 transition-transform">
            <Github className="w-5 h-5 text-gray-500 hover:text-white transition" />
          </Link>
          <Link href="https://www.producthunt.com/@morshedulmunna1" target="_blank" rel="noopener noreferrer" aria-label="Product Hunt" className="hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-gray-500 hover:text-white transition" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.803c3.22 0 5.842 2.62 5.842 5.842 0 3.22-2.62 5.842-5.842 5.842z" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
