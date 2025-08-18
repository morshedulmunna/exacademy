"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Shield, Users, GraduationCap } from "lucide-react";
import { apiDocConfig } from "@/data/api-docs";
import { cn, getMethodColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDocs } from "@/components/docs-context";

/**
 * Sidebar component with API categories and navigation
 */
export function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["auth"]);
  const { searchQuery, isMobileSidebarOpen, closeMobileSidebar } = useDocs();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons = {
      auth: Shield,
      users: Users,
      courses: GraduationCap,
    };
    return icons[categoryId as keyof typeof icons] || BookOpen;
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return apiDocConfig.categories;
    return apiDocConfig.categories
      .map((c) => ({
        ...c,
        endpoints: c.endpoints.filter((e) => [e.title, e.description, e.path, e.method, ...(e.tags || [])].filter(Boolean).join(" ").toLowerCase().includes(q)),
      }))
      .filter((c) => c.endpoints.length > 0);
  }, [searchQuery]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeMobileSidebar} aria-hidden />}

      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-200 ease-in-out",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">API Reference</h2>

            <nav className="space-y-2">
              {filteredCategories.map((category) => {
                const Icon = getCategoryIcon(category.id);
                const isExpanded = expandedCategories.includes(category.id);

                return (
                  <div key={category.id} className="space-y-1">
                    <Button variant="ghost" className="w-full justify-between h-auto p-2" onClick={() => toggleCategory(category.id)}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>

                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {category.endpoints.map((endpoint) => (
                          <Button key={endpoint.id} variant="ghost" size="sm" className="w-full justify-start h-auto p-2 text-sm" asChild>
                            <a href={`#${endpoint.id}`} className="flex items-center space-x-2">
                              <span className={cn("px-2 py-1 rounded text-xs font-mono", getMethodColor(endpoint.method))}>{endpoint.method}</span>
                              <span className="truncate">{endpoint.title}</span>
                            </a>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
