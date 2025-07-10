# Deployment Guide for Vercel

## Image Loading Issues - Solutions

### Problem

Images from external sources (like Hashnode CDN) may not load properly when deployed to Vercel.

### Solutions Implemented

#### 1. Removed Static Export

- Removed `output: "export"` from `next.config.ts`
- This allows Next.js Image optimization to work properly

#### 2. Enhanced Image Configuration

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "cdn.hashnode.com",
      port: "",
      pathname: "**",
    },
    {
      protocol: "https",
      hostname: "media.licdn.com",
      port: "",
      pathname: "**",
    },
    {
      protocol: "https",
      hostname: "**",
      port: "",
      pathname: "**",
    },
  ],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
}
```

#### 3. Image With Fallback Component

Created `ImageWithFallback` component that:

- Handles image loading errors gracefully
- Shows placeholder content when images fail to load
- Supports custom fallback components

#### 4. Placeholder Images

Created `PlaceholderImage` component that:

- Shows a styled placeholder when images are unavailable
- Displays the article title and an icon
- Maintains consistent layout

### Alternative Approaches

#### Option 1: Use Local Images

Store images locally in the `public` folder:

```typescript
// Instead of external URLs
imageUrl: "/images/blog-post-1.jpg";
```

#### Option 2: Use Image Optimization Service

Use services like Cloudinary or ImageKit:

```typescript
// Example with Cloudinary
imageUrl: "https://res.cloudinary.com/your-cloud/image/upload/v1/blog-post-1.jpg";
```

#### Option 3: Use Next.js Image Optimization

Let Next.js handle image optimization:

```typescript
// In next.config.ts
images: {
  loader: 'default',
  domains: ['cdn.hashnode.com', 'media.licdn.com'],
}
```

### Vercel Deployment Steps

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Fix image loading issues"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js
   - Build settings should be automatic

3. **Environment Variables** (if needed)
   - Add any required environment variables in Vercel dashboard
   - No special variables needed for basic image loading

### Troubleshooting

#### Images Still Not Loading?

1. Check browser console for CORS errors
2. Verify image URLs are accessible
3. Check Vercel build logs for errors
4. Ensure `next.config.ts` is properly configured

#### Performance Issues?

1. Use `priority` prop for above-the-fold images
2. Implement lazy loading for images below the fold
3. Use appropriate `sizes` prop for responsive images
4. Consider using WebP format for better compression

#### CORS Issues?

1. Ensure external domains are in `remotePatterns`
2. Check if the image provider allows cross-origin requests
3. Consider using a proxy or CDN

### Best Practices

1. **Always provide fallbacks** for external images
2. **Use appropriate image formats** (WebP, AVIF)
3. **Implement lazy loading** for better performance
4. **Optimize image sizes** before uploading
5. **Use descriptive alt text** for accessibility

### Monitoring

Monitor your deployment:

- Check Vercel analytics for image loading performance
- Use browser dev tools to inspect image loading
- Test on different devices and network conditions
