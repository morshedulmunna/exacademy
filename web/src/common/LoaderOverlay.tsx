"use client";

import React from "react";
import { Loading } from "@/components/ui/loading";

interface LoaderOverlayProps {
  /** Whether the overlay is visible */
  open: boolean;
  /** Optional text shown under spinner */
  text?: string;
  /** Optional z-index override */
  zIndexClassName?: string;
  /** Optional additional classes for the backdrop */
  className?: string;
}

/**
 * LoaderOverlay
 * Reusable full-screen overlay with a centered spinner and optional text.
 * Designed for transient, blocking operations like delete/submit.
 */
export function LoaderOverlay({ open, text, zIndexClassName = "z-50", className }: LoaderOverlayProps) {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center bg-black/50 backdrop-blur-sm ${className || ""}`} aria-live="polite" aria-busy="true" role="status">
      <Loading size="lg" text={text} />
    </div>
  );
}

export default LoaderOverlay;
