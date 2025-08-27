import React from "react";

type Props = {
  children: React.ReactNode;
};

/**
 * Course details layout without header and footer for immersive learning experience
 */
export default function CourseDetailsLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="w-full">{children}</main>
    </div>
  );
}
