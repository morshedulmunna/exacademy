import React from "react";
import { Button } from "../ui/button";

export default function CourseFilters() {
  return (
    <div className="w-full md:w-64 space-y-4">
      <div className="bg-zinc-900 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            All Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Development
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Design
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Business
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            All Prices
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Under $50
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            $50 - $100
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Over $100
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Level</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            All Levels
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Beginner
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Intermediate
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Advanced
          </Button>
        </div>
      </div>
    </div>
  );
}
