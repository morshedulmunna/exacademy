"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/actions/courses/delete.action";
import LoaderOverlay from "@/common/LoaderOverlay";
import ConfirmDialog from "@common/ConfirmDialog";

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
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteCourse(courseId);

      // Close confirmation dialog
      setShowConfirmation(false);

      // Show success message
      setSuccess(`Course "${courseTitle}" deleted successfully`);

      // Call optional callback
      if (onDelete) {
        onDelete();
      }

      // Refresh current page to update the list
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the course");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowConfirmation(true)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete Course">
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        isOpen={showConfirmation}
        title="Delete Course"
        description={`Are you sure you want to delete "${courseTitle}"? This action cannot be undone and will permanently remove the course and all its content.`}
        variant="danger"
        confirmText={isDeleting ? "Deleting..." : "Delete Course"}
        cancelText="Cancel"
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />

      {/* Global Loader Overlay */}
      <LoaderOverlay open={isDeleting} text={`Deleting "${courseTitle}"...`} />
    </>
  );
}
