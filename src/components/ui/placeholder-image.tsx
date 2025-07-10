import React from "react";

interface PlaceholderImageProps {
  title?: string;
  icon?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function PlaceholderImage({ title = "Image", icon = "📝", className = "", size = "md" }: PlaceholderImageProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const titleSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center ${className}`}>
      <div className="text-center text-zinc-500">
        <div className={`${sizeClasses[size]} mb-1`}>{icon}</div>
        <div className={`${titleSizeClasses[size]} font-medium`}>{title}</div>
      </div>
    </div>
  );
}
