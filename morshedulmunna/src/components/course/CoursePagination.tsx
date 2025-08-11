import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CoursePagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="outline" size="icon" className="rounded-full">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" className="rounded-full">
        1
      </Button>
      <Button variant="outline" className="rounded-full">
        2
      </Button>
      <Button variant="outline" className="rounded-full">
        3
      </Button>
      <span className="text-gray-400">...</span>
      <Button variant="outline" className="rounded-full">
        10
      </Button>
      <Button variant="outline" size="icon" className="rounded-full">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
