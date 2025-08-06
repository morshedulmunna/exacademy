"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import React, { useState, useEffect } from "react";

type DropdownProps = {
  trigger: React.ReactNode; // Button or element to toggle the dropdown
  children: React.ReactNode; // Content inside the dropdown
  className?: string;
};

export function Dropdown({ trigger, children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (isOpen) {
      // Calculate scrollbar width

      // Prevent scrolling but keep scrollbar visible
      document.body.style.overflow = "hidden"; // Disable scrolling
      document.documentElement.style.overflowY = "scroll"; // Force scrollbar visibility
      document.body.style.paddingRight = `${scrollbarWidth}px`; // Adjust for scrollbar width
    } else {
      // Reset styles when dropdown is closed
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.paddingRight = `${scrollbarWidth}px`; // Adjust for scrollbar width
    }

    // Cleanup function to reset overflow styles when component unmounts or isOpen changes
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.paddingRight = `${scrollbarWidth}px`; // Adjust for scrollbar width
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <div
        className={`${
          isOpen ? "opacity-100 scale-100 visible pointer-events-auto" : "opacity-0 scale-95 invisible pointer-events-none"
        } w-auto px-2 py-2 border dark:border-gray-800 dark:bg-gray-800 border-gray-100 rounded shadow ${className} z-50 h-auto bg-white transform transition-all duration-300 ease-out`}
      >
        {children}
      </div>
    </div>
  );
}
