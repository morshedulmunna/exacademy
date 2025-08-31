"use client";

import React from "react";
import { FileText, Video } from "lucide-react";

/**
 * Returns an icon component corresponding to a given content type.
 */
export function getContentIcon(type: string): React.ReactNode {
  switch (type) {
    case "VIDEO":
      return <Video className="w-4 h-4 text-red-500" />;
    case "PDF":
    case "DOCUMENT":
      return <FileText className="w-4 h-4 text-blue-500" />;
    default:
      return <FileText className="w-4 h-4 text-gray-500" />;
  }
}
