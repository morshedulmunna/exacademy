# Blog Components

This directory contains the blog-related components that have been split into smaller, more manageable pieces following the separation of concerns principle.

## Component Architecture

### Main Components

- **`Blogs.tsx`** - Main orchestrator component that fetches data and coordinates the layout
- **`BlogsHeader.tsx`** - Header section with title, description, and navigation
- **`BlogsGrid.tsx`** - Main grid layout coordinator for featured and recent sections
- **`FeaturedBlogsSection.tsx`** - Featured blogs display in the main content area
- **`RecentBlogsSection.tsx`** - Recent articles sidebar section

### Data Layer

- **`BlogsData.ts`** - Data fetching logic and dummy data management
- **`index.ts`** - Barrel export for all blog components

### Card Components

- **`FeaturesBlogCard.tsx`** - Large featured blog post cards
- **`SmallArticleCard.tsx`** - Smaller blog post cards for lists and sidebars

### Utility Components

- **`LikeButton.tsx`** - Blog post like functionality
- **`Comments.tsx`** - Blog post comments system
- **`DeletePostButton.tsx`** - Blog post deletion functionality

## Usage

### Basic Usage

```tsx
import { Blogs } from "@/components/blogs";

// Use the main component
<Blogs />;
```

### Individual Components

```tsx
import {
  BlogsHeader,
  BlogsGrid,
  FeaturedBlogsSection,
  RecentBlogsSection
} from "@/components/blogs";

// Use individual components
<BlogsHeader
  title="Custom Title"
  description="Custom description"
  viewAllUrl="/custom-blog"
/>

<BlogsGrid
  featuredBlogs={featuredPosts}
  smallBlogs={recentPosts}
/>
```

### Data Fetching

```tsx
import { fetchPosts } from "@/components/blogs";

// Fetch posts with filtering and pagination
const posts = await fetchPosts({
  page: 1,
  limit: 10,
  featured: "true",
});
```

## Benefits of This Structure

1. **Separation of Concerns** - Each component has a single responsibility
2. **Reusability** - Components can be used independently
3. **Maintainability** - Easier to update and debug individual components
4. **Testability** - Each component can be tested in isolation
5. **Performance** - Smaller components can be optimized individually
6. **Scalability** - Easy to add new features or modify existing ones

## Component Responsibilities

- **Blogs.tsx**: Data fetching, state management, and layout orchestration
- **BlogsHeader.tsx**: Header UI and navigation
- **BlogsGrid.tsx**: Layout coordination and responsive grid management
- **FeaturedBlogsSection.tsx**: Featured posts display logic
- **RecentBlogsSection.tsx**: Recent posts sidebar logic
- **BlogsData.ts**: Data fetching, filtering, and pagination logic

## File Size Comparison

- **Original Blogs.tsx**: ~15KB (376 lines)
- **New structure**:
  - Blogs.tsx: ~1KB (30 lines)
  - Individual components: 1-4KB each
  - Total: ~17KB but much more organized and maintainable

## Future Enhancements

- Add loading states to individual components
- Implement error boundaries for each section
- Add TypeScript strict mode compliance
- Implement component-level caching strategies
- Add unit tests for each component
