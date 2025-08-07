import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CheckoutHeaderProps {
  courseSlug: string;
}

/**
 * Header component for the checkout page with back navigation and title
 */
export default function CheckoutHeader({ courseSlug }: CheckoutHeaderProps) {
  return (
    <div className="mb-8">
      <Link 
        href={`/course/${courseSlug}`} 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to course
      </Link>
      <h1 className="text-3xl font-bold text-foreground">Complete Your Purchase</h1>
      <p className="text-muted-foreground mt-2">
        Secure checkout powered by industry-standard encryption
      </p>
    </div>
  );
}
