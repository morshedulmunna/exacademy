"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  searchParams: {
    q?: string;
    category?: string;
    price_type?: string; // "free" | "paid"
    page?: string;
    per_page?: string;
  };
};

export default function CourseFilters({ searchParams }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(searchParams.q ?? "");
  const [category, setCategory] = useState(searchParams.category ?? "");
  const [priceType, setPriceType] = useState(searchParams.price_type ?? "");
  const [perPage, setPerPage] = useState(searchParams.per_page ?? "12");

  const replaceParams = (overrides: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v && v.length > 0) next.set(k, v);
      else next.delete(k);
    }
    next.set("page", "1");
    router.replace(`/course?${next.toString()}`);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      replaceParams({ q, category, price_type: priceType });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, priceType]);

  useEffect(() => {
    replaceParams({ per_page: perPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  const categoryValue = useMemo(() => category, [category]);
  const priceTypeValue = useMemo(() => priceType, [priceType]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Search</label>
        <input type="text" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses..." className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground" />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Category</label>
        <select name="category" value={categoryValue} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground">
          <option value="">All</option>
          <option value="web-development">Web Development</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="data-science">Data Science</option>
          <option value="business">Business</option>
          <option value="languages">Languages</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Price Type</label>
        <select name="price_type" value={priceTypeValue} onChange={(e) => setPriceType(e.target.value)} className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground">
          <option value="">Any</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Per Page</label>
        <select name="per_page" value={perPage} onChange={(e) => setPerPage(e.target.value)} className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground">
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="18">18</option>
          <option value="24">24</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="px-4 py-2 rounded-md border border-border hover:bg-accent text-foreground" onClick={() => router.replace("/course")}>
          Reset
        </button>
      </div>
    </div>
  );
}
