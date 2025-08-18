"use client";

import { Search, Menu, Moon, Sun, Github, BookText } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDocs } from "@/components/docs-context";

/**
 * Header component with navigation, search, and theme controls
 */
export function Header() {
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery, toggleMobileSidebar } = useDocs();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex lg:justify-between h-16 items-center gap-2 px-2 sm:px-4">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileSidebar} aria-label="Toggle sidebar">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EA</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">Execute Academy API</h1>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Center: unified, responsive search */}
        <div className="relative flex-1 min-w-0 max-w-md self-stretch hidden sm:flex items-center">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search endpoints..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Show a compact search on very small screens where center might be hidden */}
          <div className="relative w-full max-w-[45vw] flex sm:hidden">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>

          <Badge variant="outline" className="hidden sm:inline-flex">
            REST API
          </Badge>
          <Button variant="ghost" size="sm" asChild>
            <a href="/docs" className="gap-2">
              <BookText className="h-4 w-4" /> <span className="hidden sm:inline">Docs</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/executeacademy" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
