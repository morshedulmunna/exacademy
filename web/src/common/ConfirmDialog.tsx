"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * ConfirmDialog
 * A reusable confirmation modal for destructive or important actions.
 */
export default function ConfirmDialog({ isOpen, title = "Confirm", description, confirmText = "Confirm", cancelText = "Cancel", variant = "default", onConfirm, onCancel, loading = false }: ConfirmDialogProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger enter animation on mount
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
    // Reset when unmounted
    setShow(false);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className={`p-6 space-y-6 transform transition-all duration-200 ease-out ${show ? "opacity-100 translate-y-0 sm:scale-100" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}`}>
        {(description || variant === "danger") && (
          <div className="flex items-start gap-3">
            {variant === "danger" && (
              <div className="shrink-0 rounded-full bg-red-50 dark:bg-red-900/10 p-4">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            )}
            <div className="space-y-1">{description && <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>}</div>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              variant === "danger" ? "bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-600" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-600"
            } disabled:opacity-50`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
