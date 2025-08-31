"use client";

import React from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { updateCourseAction } from "@/actions/courses/update.action";
import ImageUpload from "@/components/ui/ImageUpload";

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  defaultValues: {
    title: string;
    description: string;
    excerpt?: string;
    thumbnail?: string;
    price: number;
    original_price?: number | null;
    duration: string;
    lessons: number;
    students: number;
    published: boolean;
    featured: boolean;
  };
  onUpdated?: () => void;
}

/**
 * CourseEditModal
 * Client modal with simple form to update course fields partially.
 */
export default function CourseEditModal({ isOpen, onClose, courseId, defaultValues, onUpdated }: CourseEditModalProps) {
  const [form, setForm] = React.useState({
    title: defaultValues.title || "",
    description: defaultValues.description || "",
    excerpt: defaultValues.excerpt || "",
    thumbnail: defaultValues.thumbnail || "",
    price: defaultValues.price || 0,
    original_price: defaultValues.original_price ?? undefined,
    duration: defaultValues.duration || "",
    lessons: defaultValues.lessons || 0,
    students: defaultValues.students || 0,
    published: defaultValues.published || false,
    featured: defaultValues.featured || false,
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setForm({
        title: defaultValues.title || "",
        description: defaultValues.description || "",
        excerpt: defaultValues.excerpt || "",
        thumbnail: defaultValues.thumbnail || "",
        price: defaultValues.price || 0,
        original_price: defaultValues.original_price ?? undefined,
        duration: defaultValues.duration || "",
        lessons: defaultValues.lessons || 0,
        students: defaultValues.students || 0,
        published: defaultValues.published || false,
        featured: defaultValues.featured || false,
      });
      setError(null);
    }
  }, [isOpen, defaultValues]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = {};
      for (const [key, val] of Object.entries(form)) {
        if (val !== undefined && val !== null && val !== (typeof val === "string" ? "" : val)) {
          payload[key] = val;
        }
      }
      const res = await updateCourseAction(courseId, payload);
      if ((res as any)?.success === false) {
        throw new Error((res as any)?.message || "Failed to update");
      }
      onClose();
      onUpdated?.();
    } catch (err: any) {
      setError(err?.message || "Failed to update course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit course">
      <form onSubmit={onSubmit} className="p-4 space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" value={form.title} onChange={onChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input name="duration" value={form.duration} onChange={onChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" step="0.01" name="price" value={form.price} onChange={onChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Original Price</label>
            <input type="number" step="0.01" name="original_price" value={form.original_price ?? 0} onChange={onChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={onChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" rows={4} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <ImageUpload
              category="thumbnails"
              aspectRatio="video"
              showPreview={true}
              className="!p-3"
              placeholder="Drop image here or click to upload"
              initialUrl={form.thumbnail}
              onImageUploaded={(f) => setForm((p) => ({ ...p, thumbnail: f.original }))}
              onImageRemoved={() => setForm((p) => ({ ...p, thumbnail: "" }))}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" checked={form.published} onChange={onChange} />
            Published
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
            Featured
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
