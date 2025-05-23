import React from "react";

type Props = {};

export default function SmallArticleCard({}: Props) {
  return (
    <>
      <article className="bg-zinc-900 rounded-xl overflow-hidden group hover:bg-zinc-800 transition-colors">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
            <span>Dec 5, 2024</span>
            <span>•</span>
            <span>15 min read</span>
          </div>
          <h3 className="text-lg font-bold mb-3 group-hover:text-cyan-400 transition-colors">Docker in Production: Security and Optimization</h3>
          <p className="text-gray-400 text-sm mb-4">Essential security practices and optimization techniques for running Docker containers in production environments.</p>
          <div className="flex items-center gap-2">
            <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-gray-300">Docker</span>
            <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-gray-300">DevOps</span>
          </div>
        </div>
      </article>
    </>
  );
}
