import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
  showFallbackOnError?: boolean;
}

export default function ImageWithFallback({ src, alt, fallbackSrc, fallbackComponent, showFallbackOnError = true, ...props }: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setImageError(true);
    }
  };

  if (imageError && showFallbackOnError) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    // Default fallback
    return (
      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center text-zinc-500">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-xs font-medium">{alt}</div>
        </div>
      </div>
    );
  }

  return <Image {...props} src={currentSrc} alt={alt} onError={handleError} />;
}
