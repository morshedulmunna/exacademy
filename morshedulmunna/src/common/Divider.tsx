import React from "react";

type Props = {
  type: "horizontal" | "vertical";
  className?: string;
};

export default function Divider({ type, className }: Props) {
  const dividerStyle =
    type === "horizontal"
      ? "h-px bg-gray-300 dark:bg-gray-700" // For light and dark mode
      : "w-px bg-gray-300 dark:bg-gray-700 h-full"; // For vertical divider

  return <div className={`${dividerStyle} ${className}`}></div>;
}
