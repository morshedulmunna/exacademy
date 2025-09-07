// Admin Interface Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  verified: boolean;
}

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  instructor: {
    name: string;
    email: string;
  };
  published: boolean;
  price: number;
  students: number;
  rating: number;
  totalLessons: number;
  totalDuration: number;
  category: string;
  createdAt: string;
  image?: string;
}

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
  tags: string[];
  viewCount: number;
  readTime: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  publishedCourses: number;
  totalPosts: number;
  publishedPosts: number;
  totalRevenue: number;
  totalEnrollments: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface AdminActivity {
  type: 'course_enrollment' | 'new_user' | 'course_completion' | 'payment';
  user: string;
  course?: string;
  time: string;
  revenue?: number;
}

// Component Props Types
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

export interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
  }>;
}


// Event Handler Types
export type DraftSelectHandler = (draftId: string) => void;
export type NewDraftHandler = () => void;
export type SearchHandler = (query: string) => void;
export type AddCoverHandler = () => void;
export type AddSubtitleHandler = () => void;
export type PublishHandler = () => void;
export type CopyMarkdownHandler = () => void;
export type ToggleDarkModeHandler = (enabled: boolean) => void;
export type ToggleRawEditorHandler = (enabled: boolean) => void;
export type TabChangeHandler = (tab: "write" | "preview") => void;
export type TitleChangeHandler = (title: string) => void;
export type ContentChangeHandler = (content: string) => void;
