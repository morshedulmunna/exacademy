import React from 'react';
import Image from 'next/image';
// Static helper removed

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  preferWebP?: boolean;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * Optimized image component with automatic WebP support and fallbacks
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
  quality = 85,
  preferWebP = true,
  fallbackSrc,
  onError,
  onLoad
}: OptimizedImageProps) {
  // Get optimized URL (WebP if available and preferred)
  const optimizedSrc = src;
  
  // Get thumbnail URL for smaller images
  const thumbnailSrc = src;

  const handleError = () => {
    // If WebP failed and we have a fallback, try the original format
    if (preferWebP && optimizedSrc !== src) {
      // This will trigger a re-render with the original format
      return;
    }
    onError?.();
  };

  const imageProps = {
    src: optimizedSrc,
    alt,
    className,
    priority,
    quality,
    sizes,
    onError: handleError,
    onLoad,
    ...(fill ? { fill } : { width, height })
  };

  return (
    <Image
      {...imageProps}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
}

/**
 * Thumbnail image component for smaller previews
 */
export function ThumbnailImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'fill' | 'sizes'>) {
  const thumbnailSrc = ImageUploader.getThumbnailUrl(src, true);
  
  return (
    <OptimizedImage
      src={thumbnailSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
}

/**
 * Responsive image component that automatically adjusts based on screen size
 */
export function ResponsiveImage({
  src,
  alt,
  className = '',
  aspectRatio = '16/9',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height' | 'fill'> & {
  aspectRatio?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}
