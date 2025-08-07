"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckoutLayout, CheckoutGrid, CheckoutLoading, CheckoutHeader, CheckoutForm, OrderSummary, CourseData } from "@/components/checkout";

export default function CourseCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Mock course data - in real app, fetch from API
  const courseData: CourseData = {
    id: "1",
    title: "Docker Mastery: Complete Course for Beginners",
    slug: params.slug_course as string,
    description: "Learn Docker from scratch with hands-on projects and real-world examples. Master containerization, orchestration, and deployment.",
    price: 999,
    originalPrice: 1499,
    instructor: {
      name: "Morshedul Munna",
      avatar: "/placeholder-user.jpg",
    },
    duration: "11h 45m",
    lessons: 33,
    students: 1247,
    image: "/docker-course.png",
    features: ["Lifetime access to course content", "Certificate of completion", "Downloadable resources", "Mobile and TV access", "30-day money-back guarantee"],
  };

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(`/login?callbackUrl=/course/checkout/${params.slug_course}`);
      return;
    }
  }, [session, status, router, params.slug_course]);

  const handlePaymentSuccess = () => {
    // Redirect to success page or course
    router.push(`/course/${courseData.slug}?purchased=true`);
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment failed:", error);
    // Handle payment error - could show toast notification
  };

  if (status === "loading") {
    return <CheckoutLoading />;
  }

  return (
    <CheckoutLayout>
      <CheckoutHeader courseSlug={courseData.slug} />

      <CheckoutGrid>
        <CheckoutForm courseData={courseData} onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />

        <div className="lg:col-span-1">
          <OrderSummary courseData={courseData} />
        </div>
      </CheckoutGrid>
    </CheckoutLayout>
  );
}
