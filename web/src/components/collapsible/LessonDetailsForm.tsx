"use client";

import React from "react";

interface LessonBasics {
  id: string;
  title: string;
  description?: string;
  duration: string;
  is_free: boolean;
  published: boolean;
}

interface LessonDetailsFormProps {
  courseId: string;
  lessonId: string;
  lesson: LessonBasics;
  details: {
    contents: Array<{ id: string; title?: string; content_type?: string; url?: string; filename?: string; file_size?: number; position?: number }>;
    questions: Array<{ id: string; text?: string; position?: number }>;
    assignment: any;
  } | null;
}

/**
 * Read-only lesson details form populated from API
 */
export default function LessonDetailsForm({ courseId, lessonId, lesson, details }: LessonDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input type="text" defaultValue={lesson.title} readOnly className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
          <input type="text" defaultValue={lesson.duration} readOnly className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            defaultValue={lesson.description || ""}
            readOnly
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={lesson.is_free} readOnly className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 bg-white dark:bg-gray-700" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Is Free</span>
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={lesson.published} readOnly className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 bg-white dark:bg-gray-700" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published</span>
          </label>
        </div>
      </div>

      {/* Contents */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Resources</h4>
        {details?.contents?.length ? (
          <ul className="space-y-2">
            {details.contents.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 p-2">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{c.title || c.filename || "Untitled"}</span>
                  {c.content_type && <span className="ml-2 text-xs text-gray-500">({c.content_type})</span>}
                </div>
                {typeof c.file_size === "number" && <span className="text-xs text-gray-500">{(c.file_size / (1024 * 1024)).toFixed(1)} MB</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No resources</p>
        )}
      </div>

      {/* Questions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Questions</h4>
        {details?.questions?.length ? (
          <ul className="space-y-2">
            {details.questions.map((q) => (
              <li key={q.id} className="rounded-md border border-gray-200 dark:border-gray-700 p-2 text-sm text-gray-700 dark:text-gray-300">
                {q.text || "Untitled question"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No questions</p>
        )}
      </div>

      {/* Assignment */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Assignment</h4>
        {details?.assignment ? <pre className="text-xs bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-md p-3 overflow-x-auto">{JSON.stringify(details.assignment, null, 2)}</pre> : <p className="text-sm text-gray-500">No assignment</p>}
      </div>
    </div>
  );
}
