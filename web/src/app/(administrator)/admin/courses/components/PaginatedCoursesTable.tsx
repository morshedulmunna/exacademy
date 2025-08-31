"use client";
import React from "react";
import Pagination from "@/common/Pagination";
import { CoursesTable } from "./CoursesTable";
import type { AdminCourseItem } from "./CoursesTable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginatedCoursesTableProps {
  courses: AdminCourseItem[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * PaginatedCoursesTable
 * Client component that slices data and renders table + pagination.
 */
export const PaginatedCoursesTable: React.FC<PaginatedCoursesTableProps> = ({ courses, total, page, pageSize }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onPageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(nextPage));
    params.set("per_page", String(pageSize));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg">
        <CoursesTable courses={courses} />
      </div>
      <div className="flex justify-end">
        <Pagination className="w-auto" numberOfData={total} limits={pageSize} activePage={page} getCurrentPage={onPageChange} />
      </div>
    </div>
  );
};
