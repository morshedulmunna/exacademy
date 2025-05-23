import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

export default function WorkExperiance({}: Props) {
  return (
    <>
      {/* Work Experience */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
          <p className="text-gray-400 mb-16">I switch a lot of companies. It's mostly about the culture.</p>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-md">
                  <span className="font-mono">T</span>
                </div>
                <span className="text-gray-400">Teachyst</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-md">
                  <span className="font-mono">D</span>
                </div>
                <span className="text-gray-400">Dimension</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-md">
                  <span className="font-mono">E</span>
                </div>
                <span className="text-gray-400">Emitrr</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-md">
                  <span className="font-mono">T</span>
                </div>
                <span className="text-gray-400">Tryst</span>
              </div>
            </div>

            <div>
              <div className="mb-2">
                <h3 className="text-xl font-bold">
                  Founder & CEO{" "}
                  <Link href="#" className="text-cyan-400">
                    @Teachyst
                  </Link>
                </h3>
                <p className="text-gray-400">Sep 2024 - Present</p>
                <p className="text-gray-400 mt-1">India</p>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span className="text-gray-300">White Labeled NextGen LMS</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span className="text-gray-300">Platform for educators and creators</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
