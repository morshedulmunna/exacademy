import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Youtube, Twitter, Linkedin, Github, Check } from "lucide-react";
import { Button } from "./ui/button";

type Props = {};

export default function Hero({}: Props) {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Trust me, I'm a <span className="text-cyan-400">software engineer</span>.
            </h1>
            <p className="text-gray-400 max-w-lg">
              Meet Piyush Garg, content creator, educator, and entrepreneur known for his expertise in the tech industry. He has successfully launched numerous technical courses on
              various platforms. Founder of Teachyst, white- labeled Learning Management System (LMS) to help educators monetize their content globally.
            </p>
            <p className="text-gray-500 text-sm">— ChatGPT</p>

            <div className="pt-4">
              <p className="flex items-center gap-2">
                Building <span className="font-semibold">Teachyst</span>
                <span className="text-gray-400">next-gen LMS</span>
                <span className="text-white">✨</span>
              </p>
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-discord"
              >
                <circle cx="9" cy="12" r="1" />
                <circle cx="15" cy="12" r="1" />
                <path d="M8 17a5 5 0 0 1 8 0" />
                <path d="M15.2 9a5 5 0 0 0-6.4 0" />
                <path d="M17.8 5a9 9 0 0 0-11.6 0" />
                <path d="M19 7v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />
              </svg>
              Join Discord
            </Button>
          </div>
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-SegnqQekTqIit8uxDTJRy5HsOu21sz.png"
              alt="Profile Image"
              width={600}
              height={600}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
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
      </section>
    </>
  );
}
