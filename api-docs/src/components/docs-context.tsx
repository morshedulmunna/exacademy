"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface DocsContextValue {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isMobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
}

const DocsContext = createContext<DocsContextValue | null>(null);

/**
 * DocsProvider supplies shared UI state for the docs experience:
 * - global search query
 * - mobile sidebar open/close state
 */
export function DocsProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const openMobileSidebar = useCallback(() => setIsMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);
  const toggleMobileSidebar = useCallback(() => setIsMobileSidebarOpen((p) => !p), []);

  const value = useMemo(() => ({ searchQuery, setSearchQuery, isMobileSidebarOpen, openMobileSidebar, closeMobileSidebar, toggleMobileSidebar }), [searchQuery, isMobileSidebarOpen, openMobileSidebar, closeMobileSidebar, toggleMobileSidebar]);

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
}

/**
 * Hook to access docs UI state
 */
export function useDocs() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be used within a DocsProvider");
  return ctx;
}
