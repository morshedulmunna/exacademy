import React from "react";
import { Button } from "../ui/button";
import SmallArticleCard from "./SmallArticleCard";
import FeaturesBlogCard from "./FeaturesBlogCard";

type Props = {};

export default function Blogs({}: Props) {
  return (
    <>
      {/* Blogs */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest Blog Posts</h2>
              <p className="text-gray-400">Sharing insights on software engineering, tech trends, and development practices.</p>
            </div>
            <Button variant="outline" className="hidden text-black md:flex">
              View All Posts
            </Button>
          </div>

          {/* Updated Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Featured Blog Post (Left Column) */}
            <div className="lg:col-span-2">
              <FeaturesBlogCard />
              <FeaturesBlogCard />
            </div>

            {/* Right Column with 2 Smaller Posts */}
            <div className="flex flex-col gap-4">
              <SmallArticleCard />
              <SmallArticleCard />
              <SmallArticleCard />
              <SmallArticleCard />
            </div>
          </div>

          {/* Mobile View All Button */}
          <div className="flex justify-center mt-8 md:hidden">
            <Button variant="outline">View All Posts</Button>
          </div>
        </div>
      </section>
    </>
  );
}
