import React from "react";
import NewCourseForm from "../../new/NewCourseForm";
import { getCourseBySlugAction } from "@/actions/courses/get-course.action";

interface Props {
  params: { slug: string };
}

export default async function EditCoursePage({ params }: Props) {
  const { success, data } = await getCourseBySlugAction(params.slug);
  const c = success ? data : null;
  const initial = c
    ? {
        id: c.id,
        title: c.title || "",
        slug: c.slug || "",
        price: String(c.price ?? ""),
        originalPrice: c.original_price != null ? String(c.original_price) : undefined,
        duration: c.duration || "",
        excerpt: c.excerpt || "",
        description: c.description || "<p></p>",
        featured: Boolean(c.featured),
        status: (c.status as any) || "draft",
        thumbnail: c.thumbnail || undefined,
        category: "",
        outcomes: c.outcomes || [],
      }
    : undefined;
  return <NewCourseForm mode="edit" course={initial as any} />;
}
