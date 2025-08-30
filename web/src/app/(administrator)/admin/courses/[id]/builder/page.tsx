import React from "react";
import { notFound } from "next/navigation";
import API from "@/configs/api.config";

/**
 * Course Builder Page
 * Minimal builder to add modules and lessons for a course
 */
export default async function CourseBuilderPage({ params }: { params: { id: string } }) {
  const courseId = params.id;
  if (!courseId) return notFound();

  async function createModule(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const position = Number(formData.get("position") || 1);
    if (!title) throw new Error("Module title required");
    await API.post(`/api/courses/${courseId}/modules`, { title, description: description || undefined, position }, { responseType: "text" });
  }

  async function createLesson(formData: FormData) {
    "use server";
    const moduleId = String(formData.get("module_id") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const duration = String(formData.get("duration") || "").trim();
    const position = Number(formData.get("position") || 1);
    const is_free = formData.get("is_free") === "on";
    const published = formData.get("published") === "on";
    const description = String(formData.get("description") || "").trim();
    if (!moduleId || !title || !duration) throw new Error("Lesson fields missing");
    await API.post(`/api/modules/${moduleId}/lessons`, { module_id: moduleId, title, duration, position, is_free, published, description: description || undefined }, { responseType: "text" });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Course Builder</h1>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-medium">Add Module</h2>
        <form action={createModule} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
            <input name="title" required className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
            <input name="description" className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-3">
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Position</label>
              <input name="position" type="number" min="1" defaultValue={1} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="self-end inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Module
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-medium">Add Lesson</h2>
        <form action={createLesson} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Module ID</label>
            <input name="module_id" required placeholder="Target module UUID" className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
            <input name="title" required className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Duration</label>
            <input name="duration" required placeholder="e.g. 10m" className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Position</label>
              <input name="position" type="number" min="1" defaultValue={1} className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input id="is_free" name="is_free" type="checkbox" className="h-4 w-4" />
              <label htmlFor="is_free" className="text-sm">
                Free
              </label>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input id="published" name="published" type="checkbox" className="h-4 w-4" />
              <label htmlFor="published" className="text-sm">
                Published
              </label>
            </div>
            <button type="submit" className="self-end inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Lesson
            </button>
          </div>
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description (optional)</label>
            <input name="description" className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
          </div>
        </form>
      </section>
    </div>
  );
}
