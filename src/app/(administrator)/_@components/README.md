# Blog Editor Components

This directory contains modular, reusable components for the blog editor functionality.

## Components Overview

### 1. BlogSidebar

**File:** `BlogSidebar.tsx`

The left sidebar component that provides navigation and draft management.

**Features:**

- User profile display
- Search functionality for drafts
- New draft creation
- Collapsible sections for drafts and published articles
- Draft selection and management

**Props:**

```typescript
interface BlogSidebarProps {
  onDraftSelect?: (draftId: string) => void;
  onNewDraft?: () => void;
  onSearch?: (query: string) => void;
}
```

### 2. BlogEditorHeader

**File:** `BlogEditorHeader.tsx`

The top header component with article controls and settings dropdown.

**Features:**

- Add cover image button
- Add subtitle button
- Settings dropdown menu
- Dark mode toggle
- Raw markdown editor toggle
- Copy markdown functionality
- Publish button

**Props:**

```typescript
interface BlogEditorHeaderProps {
  onAddCover?: () => void;
  onAddSubtitle?: () => void;
  onPublish?: () => void;
  onCopyMarkdown?: () => void;
  onToggleDarkMode?: (enabled: boolean) => void;
  onToggleRawEditor?: (enabled: boolean) => void;
  darkMode?: boolean;
  rawMarkdownEditor?: boolean;
}
```

### 3. BlogEditorContent

**File:** `BlogEditorContent.tsx`

The main content area with title input, mode toggle, and content editor.

**Features:**

- Article title input
- Write/Preview mode toggle
- Markdown content editor
- Live preview with formatting
- Cover image display in preview

**Props:**

```typescript
interface BlogEditorContentProps {
  activeTab: "write" | "preview";
  articleTitle: string;
  content: string;
  onTabChange: (tab: "write" | "preview") => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}
```

## Types

**File:** `types.ts`

Shared TypeScript interfaces and types for the blog editor components.

**Key Types:**

- `Draft` - Interface for draft articles
- `PublishedArticle` - Interface for published articles
- `BlogEditorState` - Complete editor state interface
- Event handler types for all component interactions

## Usage Example

```typescript
import { BlogSidebar, BlogEditorHeader, BlogEditorContent } from "./_@components";

export default function BlogEditor() {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [articleTitle, setArticleTitle] = useState("");
  const [content, setContent] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <BlogSidebar onDraftSelect={(draftId) => console.log("Selected:", draftId)} onNewDraft={() => console.log("New draft")} onSearch={(query) => console.log("Search:", query)} />

      <div className="flex-1 flex flex-col">
        <BlogEditorHeader
          onAddCover={() => console.log("Add cover")}
          onAddSubtitle={() => console.log("Add subtitle")}
          onPublish={() => console.log("Publish")}
          onCopyMarkdown={() => console.log("Copy markdown")}
          onToggleDarkMode={(enabled) => setDarkMode(enabled)}
          darkMode={darkMode}
        />

        <BlogEditorContent activeTab={activeTab} articleTitle={articleTitle} content={content} onTabChange={setActiveTab} onTitleChange={setArticleTitle} onContentChange={setContent} />
      </div>
    </div>
  );
}
```

## Features

### ✅ Implemented

- [x] Modular component architecture
- [x] TypeScript type safety
- [x] Event handler callbacks
- [x] Dark mode toggle
- [x] Raw markdown editor toggle
- [x] Copy markdown functionality
- [x] Live preview with markdown rendering
- [x] Collapsible sidebar sections
- [x] Search functionality
- [x] Draft management
- [x] Responsive design

### 🔄 TODO

- [ ] Cover image upload functionality
- [ ] Subtitle management
- [ ] Draft auto-save
- [ ] Article publishing API integration
- [ ] Image upload and management
- [ ] Advanced markdown features
- [ ] Keyboard shortcuts
- [ ] Undo/Redo functionality

## Styling

All components use Tailwind CSS classes and follow a consistent dark theme design. The components are fully responsive and include hover states and transitions for a smooth user experience.

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
