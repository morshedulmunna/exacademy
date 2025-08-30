"use client";
import React, { useMemo, useState } from "react";
import Pagination from "@/common/Pagination";
import { CoursesTable } from "./CoursesTable";
import type { AdminCourseItem } from "./CoursesTable";

interface PaginatedCoursesTableProps {
  courses: AdminCourseItem[];
  pageSize?: number;
}

/**
 * PaginatedCoursesTable
 * Client component that slices data and renders table + pagination.
 */
export const PaginatedCoursesTable: React.FC<PaginatedCoursesTableProps> = ({ courses, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = useMemo(() => courses.slice(startIndex, endIndex), [courses, startIndex, endIndex]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg">
        <CoursesTable courses={currentPageData} />
      </div>
      <div className="flex justify-end">
        <Pagination className="w-auto" numberOfData={courses.length} limits={pageSize} activePage={currentPage} getCurrentPage={(p) => setCurrentPage(p)} />
      </div>
    </div>
  );
};
