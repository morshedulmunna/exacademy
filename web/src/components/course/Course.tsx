import React from "react";
import Link from "next/link";
import CourseCard from "./CourseCard";
import listCoursesPaginated from "@/actions/courses/listPaginated";

type Props = {
  page?: number;
  perPage?: number;
};

export default async function Course({ page = 1, perPage = 6 }: Props) {
  const { items: courses, meta } = await listCoursesPaginated(page, perPage);

  return (
    <>
      {/* Courses */}
      <section className="py-20 ">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Courses</h2>
          <p className="text-muted-foreground mb-16">Explore a selection of courses designed to help you enhance your skills.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 && <p className="text-muted-foreground">No courses available right now.</p>}
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description}
                excerpt={course.excerpt ?? undefined}
                thumbnail={course.thumbnail ?? undefined}
                duration={course.duration}
                lessons={course.lessons}
                price={course.price}
                originalPrice={course.original_price ?? undefined}
              />
            ))}
          </div>
          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              {meta.page > 1 ? (
                <Link aria-label="Previous page" className="px-4 py-2 rounded-md border border-border hover:bg-accent text-foreground" href={`/?page=${meta.page - 1}&per_page=${meta.per_page}`}>
                  ← Previous
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-md border border-border text-muted-foreground cursor-not-allowed">← Previous</span>
              )}
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.total_pages}
              </span>
              {meta.page < meta.total_pages ? (
                <Link aria-label="Next page" className="px-4 py-2 rounded-md border border-border hover:bg-accent text-foreground" href={`/?page=${meta.page + 1}&per_page=${meta.per_page}`}>
                  Next →
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-md border border-border text-muted-foreground cursor-not-allowed">Next →</span>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
