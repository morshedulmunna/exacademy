import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

type Props = {};

export default function FeaturesBlogCard({}: Props) {
  return (
    <>
      <div className="h-fit bg-zinc-900 rounded-xl overflow-hidden group hover:bg-zinc-800 transition-colors mb-4">
        <div className="relative h-48 lg:h-60">
          {/* <Image src="/blog-placeholder.jpg" alt="Building Scalable Microservices" fill className="object-cover group-hover:scale-105 transition-transform duration-300" /> */}
          <div className="absolute top-4 left-4">
            <span className="bg-cyan-400 text-black px-3 py-1 rounded-full text-sm font-medium">Featured</span>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
            <span>Dec 15, 2024</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span className="bg-zinc-800 px-2 py-1 rounded text-xs">Architecture</span>
          </div>
          <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">Building Scalable Microservices: A Complete Guide</h3>
          <p className="text-gray-400 mb-6">Learn how to design and implement microservices architecture that can scale to millions of users. We'll cover service discovery, load balancing, and communication patterns.</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <Image src="/diverse-avatars.png" alt="Piyush Garg" width={32} height={32} className="rounded-full" /> */}
              <span className="text-sm text-gray-300">Piyush Garg</span>
            </div>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors duration-300">
              Read More →
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
