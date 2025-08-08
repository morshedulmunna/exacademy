"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type TocItem = { id: string; label: string };

/**
 * Sticky Table of Contents with scrollspy and smooth scrolling.
 */
export default function ScrollSpyToc({ items, className = "" }: { items: TocItem[]; className?: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className={className} aria-label="On this page">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={`#${item.id}`}
            onClick={handleClick(item.id)}
            className={`block rounded-md px-2 py-1 text-sm transition-colors hover:text-blue-600 ${isActive ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

