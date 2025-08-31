"use client";

import React from "react";
import RichTextEditor from "@/components/rich-text-editor";
import { generateFormDataFromObject, generateSlug } from "@/lib/utils";
import ImageUpload from "@/components/ui/ImageUpload";
import { DollarSign, Clock, Hash, Tag as TagIcon, X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createCourseAction } from "@/actions/courses/create.action";
import { updateCourseAction } from "@/actions/courses/update.action";
import API from "@/configs/api.config";
import { useRouter } from "next/navigation";

/**
 * NewCourseForm
 * Client-side form with live preview and rich text description
 */
type CourseInitial = {
  id?: string;
  title: string;
  slug: string;
  price: string;
  originalPrice?: string | null;
  duration: string;
  excerpt?: string;
  description: string;
  featured: boolean;
  status: "draft" | "published" | "archived";
  thumbnail?: string | File | null;
  category?: string;
  outcomes: string[];
  tags?: string[];
};

export default function NewCourseForm({ mode = "create", course }: { mode?: "create" | "edit"; course?: CourseInitial }) {
  const router = useRouter();
  const [slugManual, setSlugManual] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tags, setTags] = React.useState<string[]>(course?.tags || []);
  const [tagInput, setTagInput] = React.useState("");
  const [outcomeInput, setOutcomeInput] = React.useState("");
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
  const [slugStatus, setSlugStatus] = React.useState<"idle" | "checking" | "available" | "taken">("idle");

  const originalSlugRef = React.useRef<string | undefined>(course?.slug);

  const formik = useFormik({
    initialValues: {
      title: course?.title || "",
      slug: course?.slug || "",
      price: course?.price || "",
      originalPrice: course?.originalPrice ?? "",
      duration: course?.duration || "",
      excerpt: course?.excerpt || "",
      description: course?.description || "<p></p>",
      featured: course?.featured ?? false,
      status: course?.status || ("draft" as const),
      thumbnail: (course?.thumbnail as any) || "",
      category: course?.category || "",
      outcomes: course?.outcomes || [],
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().min(3, "Too short").required("Title is required"),
      slug: Yup.string()
        .trim()
        .test("slug-format", "Invalid slug. Use letters only, or lowercase with hyphens.", (value) => {
          if (!value) return true; // empty -> auto-generated from title
          const lettersOnly = /^[A-Za-z]+$/;
          const kebabLower = /^[a-z]+(?:-[a-z]+)*$/;
          return lettersOnly.test(value) || kebabLower.test(value);
        }),
      price: Yup.number().typeError("Must be a number").min(0, "Must be >= 0").required("Price is required"),
      originalPrice: Yup.number()
        .typeError("Must be a number")
        .min(0, "Must be >= 0")
        .nullable()
        .transform((v, o) => (o === "" ? null : v)),
      duration: Yup.string().trim().required("Duration is required"),
      excerpt: Yup.string().trim().max(300, "Max 300 characters"),
      description: Yup.string().required("Description is required"),
      category: Yup.string().trim(),
      thumbnail: Yup.string().trim(),
      featured: Yup.boolean(),
      status: Yup.string().oneOf(["draft", "published", "archived"]).required(),
      outcomes: Yup.array().of(Yup.string().trim()),
    }),
    onSubmit: async (values) => {
      await submitCourse();
    },
    enableReinitialize: true,
  });

  const computedSlug = formik.values.slug || generateSlug(formik.values.title);

  /**
   * Normalizes manual slug input: blocks spaces, strips invalid chars.
   * Allows letters-only (any case) or lowercase kebab-case with hyphens.
   */
  function sanitizeSlugInput(value: string): string {
    const lettersAndHyphensOnly = value.replace(/[^A-Za-z-]/g, "");
    const compactHyphens = lettersAndHyphensOnly.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
    if (compactHyphens.includes("-")) {
      return compactHyphens.toLowerCase();
    }
    return compactHyphens;
  }

  React.useEffect(() => {
    if (!slugManual && mode === "create") {
      formik.setFieldValue("slug", generateSlug(formik.values.title));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.title, slugManual, mode]);

  // Debounced slug availability check against public course-by-slug endpoint
  React.useEffect(() => {
    if (!computedSlug) {
      setSlugStatus("idle");
      return;
    }
    let canceled = false;
    setSlugStatus("checking");
    const t = setTimeout(async () => {
      try {
        // 200 means slug exists -> taken
        await API.get(`/api/course/${computedSlug}`);
        if (canceled) return;
        // If editing and slug unchanged, consider available
        if (mode === "edit" && originalSlugRef.current === computedSlug) {
          setSlugStatus("available");
        } else {
          setSlugStatus("taken");
          formik.setFieldError("slug", "Slug already in use");
        }
      } catch (e: any) {
        const status = e?.response?.status as number | undefined;
        // 404 means not found -> available; network errors also treated as available to avoid blocking
        if (status === 404 || !status) {
          if (canceled) return;
          setSlugStatus("available");
          // Clear error only if previously set
          if (formik.errors.slug) {
            formik.setFieldError("slug", undefined as any);
          }
        } else {
          if (canceled) return;
          setSlugStatus("idle");
        }
      }
    }, 400);
    return () => {
      canceled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedSlug, mode]);
  const parsedPrice = Number(formik.values.price || 0);
  const parsedOriginalPrice = formik.values.originalPrice ? Number(formik.values.originalPrice) : undefined;

  async function submitCourse() {
    setError(null);
    try {
      setLoading(true);
      // Prevent submit if slug taken based on latest check
      if (computedSlug && slugStatus === "taken") {
        formik.setFieldError("slug", "Slug already in use");
        throw new Error("Slug already in use");
      }
      const payload: any = {
        title: formik.values.title.trim(),
        slug: computedSlug,
        price: parsedPrice,
        original_price: parsedOriginalPrice,
        duration: formik.values.duration.trim(),
        description: formik.values.description,
        featured: formik.values.featured,
        status: formik.values.status,
        excerpt: formik.values.excerpt.trim() || undefined,
        thumbnail: formik.values.thumbnail || undefined,
        // Backend expects JSON or comma-separated strings for arrays in multipart
        outcomes: JSON.stringify(formik.values.outcomes || []),
        category: formik.values.category || undefined,
        tags: JSON.stringify(tags || []),
      };
      const generateFormData = generateFormDataFromObject(payload);
      if (mode === "edit" && course?.id) {
        const res = await updateCourseAction(course.id, generateFormData);
        if (!res?.success) {
          throw new Error(res?.message || "Failed to update course");
        }
        router.push(`/admin/courses`);
        router.refresh();
      } else {
        const res = await createCourseAction(generateFormData);
        if (!res?.success) {
          if (
            res?.status === 409 &&
            String(res?.message || "")
              .toLowerCase()
              .includes("slug")
          ) {
            formik.setFieldError("slug", "Slug already in use");
          }
          throw new Error(res?.message || "Failed to create course");
        }
        router.push(`/admin/courses/${res.data}/builder`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  // Submit is managed by formik.handleSubmit via form tag

  function markAllTouchedAndSubmit() {
    const fields = ["title", "slug", "price", "originalPrice", "duration", "excerpt", "description", "category", "thumbnail", "outcomes", "status"] as const;
    const touched: Record<string, boolean> = {};
    for (const key of fields) touched[key] = true;
    formik.setTouched(touched as any, true);
    formik.submitForm();
  }

  function handleSaveDraft() {
    formik.setFieldValue("status", "draft", false);
    markAllTouchedAndSubmit();
  }

  function handleCreate() {
    markAllTouchedAndSubmit();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 pb-24">
      <form onSubmit={formik.handleSubmit} className="md:col-span-8 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold">Basic information</h2>
            <p className="text-sm text-gray-500 mt-1">Title, slug and a short summary.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                placeholder="Course title"
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {(formik.touched.title || formik.submitCount > 0) && formik.errors.title && <p className="mt-1 text-xs text-red-600">{formik.errors.title}</p>}
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Slug</label>
                <input
                  name="slug"
                  value={formik.values.slug}
                  onChange={(e) => {
                    const v = sanitizeSlugInput(e.target.value);
                    formik.setFieldValue("slug", v);
                    setSlugManual(v.length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Spacebar") {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    if (formik.values.slug) {
                      const fixed = sanitizeSlugInput(formik.values.slug);
                      if (fixed !== formik.values.slug) formik.setFieldValue("slug", fixed);
                    }
                    if (!formik.values.slug) setSlugManual(false);
                  }}
                  placeholder="auto-from-title if empty"
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-[11px] text-gray-500">Preview: {computedSlug || "(empty)"}</p>
                {(formik.touched.slug || formik.submitCount > 0) && formik.errors.slug && <p className="mt-1 text-xs text-red-600">{String(formik.errors.slug)}</p>}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tags</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="relative flex-1">
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          e.preventDefault();
                          if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                          setTagInput("");
                        }
                      }}
                      placeholder="Add a tag and press Enter"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((t, i) => (
                      <span key={`${t}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 text-xs">
                        #{t}
                        <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="ml-1 text-blue-500 hover:text-blue-700">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Excerpt</label>
              <textarea
                name="excerpt"
                value={formik.values.excerpt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Short summary (optional)"
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {(formik.touched.excerpt || formik.submitCount > 0) && formik.errors.excerpt && <p className="mt-1 text-xs text-red-600">{formik.errors.excerpt}</p>}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold">Pricing & meta</h2>
            <p className="text-sm text-gray-500 mt-1">Set price, duration and category.</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="99.00"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {(formik.touched.price || formik.submitCount > 0) && formik.errors.price && <p className="mt-1 text-xs text-red-600">{String(formik.errors.price)}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Original price (optional)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="originalPrice"
                    value={formik.values.originalPrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="129.00"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {(formik.touched.originalPrice || formik.submitCount > 0) && formik.errors.originalPrice && <p className="mt-1 text-xs text-red-600">{String(formik.errors.originalPrice)}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="duration"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    placeholder="e.g. 12h"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {(formik.touched.duration || formik.submitCount > 0) && formik.errors.duration && <p className="mt-1 text-xs text-red-600">{formik.errors.duration}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
                <input
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Web Development"
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm"
                />
                {(formik.touched.category || formik.submitCount > 0) && formik.errors.category && <p className="mt-1 text-xs text-red-600">{String(formik.errors.category)}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Learning outcomes</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && outcomeInput.trim()) {
                        e.preventDefault();
                        formik.setFieldValue("outcomes", [...(formik.values.outcomes || []), outcomeInput.trim()]);
                        setOutcomeInput("");
                      }
                    }}
                    placeholder="Add an outcome and press Enter"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {formik.values.outcomes.length > 0 && (
                <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formik.values.outcomes.map((o, i) => (
                    <li key={`${o}-${i}`} className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-md px-3 py-2 flex items-start justify-between gap-2">
                      <span className="truncate">{o}</span>
                      <button
                        type="button"
                        onClick={() =>
                          formik.setFieldValue(
                            "outcomes",
                            formik.values.outcomes.filter((_, idx) => idx !== i)
                          )
                        }
                        aria-label={`Remove ${o}`}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Featured toggle moved to the right-side panel */}
          </div>
        </section>

        {/* Thumbnail moved to right-side preview card */}

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold">Description</h2>
            <p className="text-sm text-gray-500 mt-1">Use the editor to write a compelling description.</p>
          </div>
          <div className="p-6">
            <RichTextEditor content={formik.values.description} onChange={(val) => formik.setFieldValue("description", val)} placeholder="Detailed course description" />
            {(formik.touched.description || formik.submitCount > 0) && formik.errors.description && <p className="mt-1 text-xs text-red-600">{String(formik.errors.description)}</p>}
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end md:hidden">
          <button disabled={loading} type="submit" className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? (mode === "edit" ? "Updating..." : "Creating...") : mode === "edit" ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>

      <aside className="md:col-span-4">
        <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Thumbnail</h3>
            <ImageUpload
              category="thumbnails"
              aspectRatio="video"
              showPreview={true}
              placeholder="Drag & drop image here or click to upload"
              initialUrl={typeof formik.values.thumbnail === "string" ? (formik.values.thumbnail as string) : undefined}
              onImageUploaded={(file) => {
                console.log(file);
                formik.setFieldValue("thumbnail", file.file as File);
                if (file?.file) setThumbnailFile(file.file as File);
              }}
              onImageRemoved={() => {
                formik.setFieldValue("thumbnail", "");
                setThumbnailFile(null);
              }}
            />
            {(formik.touched.thumbnail || formik.submitCount > 0) && formik.errors.thumbnail && <p className="mt-2 text-xs text-red-600">{String(formik.errors.thumbnail)}</p>}
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                <input id="featured" checked={formik.values.featured} onChange={(e) => formik.setFieldValue("featured", e.target.checked)} name="featured" type="checkbox" className="h-4 w-4" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select name="status" value={formik.values.status} onChange={(e) => formik.setFieldValue("status", e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div>
                <div className="text-xs text-gray-500">Price</div>
                <div className="text-sm font-medium">${isNaN(parsedPrice) ? "0.00" : parsedPrice.toFixed(2)}</div>
              </div>
              {formik.values.category && (
                <div>
                  <div className="text-xs text-gray-500">Category</div>
                  <div className="text-sm font-medium">{formik.values.category}</div>
                </div>
              )}
              {formik.values.duration && (
                <div>
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="text-sm font-medium">{formik.values.duration}</div>
                </div>
              )}
              {computedSlug && (
                <div>
                  <div className="text-xs text-gray-500">Slug</div>
                  <div className="text-sm font-medium">/{computedSlug}</div>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium mb-2">Short preview</div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-3">
                  {typeof formik.values.thumbnail === "string" && formik.values.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formik.values.thumbnail as string} alt={formik.values.title || "thumbnail"} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500">IMG</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{formik.values.title || "Untitled course"}</div>
                    <div className="text-xs text-gray-500 truncate">/{computedSlug || "slug"}</div>
                  </div>
                  <span className="ml-auto inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">${isNaN(parsedPrice) ? "0.00" : parsedPrice.toFixed(2)}</span>
                </div>
                {formik.values.excerpt && <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{formik.values.excerpt}</div>}
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                  {formik.values.duration && <span className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5">{formik.values.duration}</span>}
                  {formik.values.category && <span className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5">{formik.values.category}</span>}
                  {formik.values.featured && <span className="inline-flex items-center rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5">Featured</span>}
                  {formik.values.status === "draft" && <span className="inline-flex items-center rounded bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200 px-2 py-0.5">Draft</span>}
                  {formik.values.status === "published" && <span className="inline-flex items-center rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5">Published</span>}
                  {formik.values.status === "archived" && <span className="inline-flex items-center rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200 px-2 py-0.5">Archived</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleSaveDraft}
            className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save draft"}
          </button>
          <button type="button" disabled={loading} onClick={handleCreate} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {loading ? (mode === "edit" ? "Updating..." : "Creating...") : mode === "edit" ? "Update & open builder" : "Create & open builder"}
          </button>
        </div>
      </div>
    </div>
  );
}
