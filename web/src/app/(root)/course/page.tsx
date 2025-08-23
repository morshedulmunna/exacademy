import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import CourseCard from "@/components/course/CourseCard";
import CourseFilters from "@/components/course/CourseFilters";
import listCourses from "@/actions/courses/list";
import Link from "next/link";

type SearchParams = {
  q?: string;
  category?: string;
  price_type?: string; // "free" | "paid"
  page?: string;
  per_page?: string;
};

export default async function CoursesPage({ searchParams }: { searchParams?: SearchParams }) {
  const q = (searchParams?.q ?? "").toString();
  const category = (searchParams?.category ?? "").toString();
  const priceType = (searchParams?.price_type ?? "").toString();
  const page = Number(searchParams?.page ?? 1) || 1;
  const perPage = Number(searchParams?.per_page ?? 12) || 12;

  const all = await listCourses();

  // Filter
  const normalizedQ = q.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  let filtered = all.filter((c) => {
    if (normalizedQ) {
      const hay = `${c.title} ${c.description} ${c.excerpt ?? ""}`.toLowerCase();
      if (!hay.includes(normalizedQ)) return false;
    }
    if (normalizedCategory) {
      const hay = `${c.slug} ${c.title} ${c.description} ${c.excerpt ?? ""}`.toLowerCase();
      if (!hay.includes(normalizedCategory)) return false;
    }
    if (priceType === "free" && c.price > 0) return false;
    if (priceType === "paid" && c.price === 0) return false;
    return true;
  });

  // Sort by newest by default
  filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Paginate
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const buildHref = (params: { page?: number; per_page?: number }) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("category", category);
    if (priceType) next.set("price_type", priceType);
    next.set("page", String(params.page ?? safePage));
    next.set("per_page", String(params.per_page ?? perPage));
    return `/course?${next.toString()}`;
  };

  return (
    <MaxWidthWrapper>
      <div className="pt-24">
        <h1 className="text-3xl font-bold text-foreground mb-6">All Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <CourseFilters searchParams={searchParams ?? {}} />
          </aside>

          {/* Grid */}
          <section className="md:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.length === 0 && <p className="text-muted-foreground">No courses match your filters.</p>}
              {pageItems.map((course) => (
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
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                {safePage > 1 ? (
                  <Link className="px-4 py-2 rounded-md border border-border hover:bg-accent text-foreground" href={buildHref({ page: safePage - 1 })}>
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-md border border-border text-muted-foreground">← Previous</span>
                )}
                <span className="text-sm text-muted-foreground">
                  Page {safePage} of {totalPages}
                </span>
                {safePage < totalPages ? (
                  <Link className="px-4 py-2 rounded-md border border-border hover:bg-accent text-foreground" href={buildHref({ page: safePage + 1 })}>
                    Next →
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-md border border-border text-muted-foreground">Next →</span>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
