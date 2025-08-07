import React from "react";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component for the checkout page with responsive grid structure
 */
export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <MaxWidthWrapper>
      <div className="min-h-screen py-8">
        {children}
      </div>
    </MaxWidthWrapper>
  );
}

/**
 * Grid container for checkout content with responsive layout
 */
export function CheckoutGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {children}
    </div>
  );
}

/**
 * Loading component for checkout page
 */
export function CheckoutLoading() {
  return (
    <MaxWidthWrapper>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    </MaxWidthWrapper>
  );
}
