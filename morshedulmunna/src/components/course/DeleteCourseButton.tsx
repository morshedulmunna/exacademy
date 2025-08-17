"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteCourseButtonProps {
  courseId: string;
  courseTitle: string;
  onDelete?: () => void;
}

/**
 * Delete Course Button Component
 * Handles course deletion with confirmation dialog
 */
export default function DeleteCourseButton({ courseId, courseTitle, onDelete }: DeleteCourseButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Static UI: pretend delete succeeded

      // Close confirmation dialog
      setShowConfirmation(false);

      // Call optional callback
      if (onDelete) {
        onDelete();
      }

      // Refresh the page to update the course list
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the course");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowConfirmation(true)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete Course" disabled={isDeleting}>
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delete Course</h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{courseTitle}"</strong>? This action cannot be undone and will permanently remove the course and all its content.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" disabled={isDeleting}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
