import React from "react";
import { Button } from "../ui/button";

type Props = {};

export default function NewsLatter({}: Props) {
  return (
    <div>
      <div className="mt-16 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">Get the latest blog posts and tutorials delivered directly to your inbox. No spam, unsubscribe anytime.</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium">Subscribe</Button>
        </div>
        <p className="text-gray-500 text-xs mt-3">Join 2,500+ developers who are already subscribed.</p>
      </div>

      {/* Mobile View All Button */}
      <div className="flex justify-center mt-8 md:hidden">
        <Button variant="outline">View All Posts</Button>
      </div>
    </div>
  );
}
