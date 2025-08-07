// Blog Editor Types
export interface Draft {
  id: string;
  title: string;
  isActive?: boolean;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PublishedArticle {
  id: string;
  title: string;
  slug?: string;
  publishedAt?: Date;
  readTime?: number;
}

export interface BlogEditorState {
  activeTab: "write" | "preview";
  articleTitle: string;
  content: string;
  darkMode: boolean;
  rawMarkdownEditor: boolean;
  showDropdown: boolean;
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
