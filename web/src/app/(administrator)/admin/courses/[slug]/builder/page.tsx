import React from "react";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import CourseBuilder from "@/components/course/CourseBuilder";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseBuilderPage({ params }: Props) {
  const { slug } = await params;

  // Resolve courseId by slug via backend public endpoint on the server
  let courseId: string | undefined = undefined;
  try {
    const base = process.env.API_BASE_URL || "http://localhost:9098";
    const res = await fetch(`${base}/api/course/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      courseId = json?.data?.id ?? undefined;
    }
  } catch {}

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Course Builder</h1>
        <p className="text-sm text-gray-500">Manage modules and lessons for: {slug}</p>
      </div>
      <CourseBuilder courseId={courseId} className="mb-10" />
    </div>
  );
}
