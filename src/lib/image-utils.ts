// Image utility functions

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const getImageFallbackUrl = (originalUrl: string): string => {
  // You can add your own fallback image URLs here
  const fallbackImages = ["https://via.placeholder.com/400x300/1f2937/6b7280?text=Blog+Post", "https://via.placeholder.com/400x300/374151/9ca3af?text=Article"];

  // Return a random fallback image
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};

export const optimizeImageUrl = (url: string, width: number = 800): string => {
  if (!isValidImageUrl(url)) return url;

  // For Hashnode images, you can add optimization parameters
  if (url.includes("cdn.hashnode.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=${width}&h=${Math.round(width * 0.6)}&fit=crop&crop=entropy&auto=compress,format&format=webp`;
  }

  return url;
};

export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
};
