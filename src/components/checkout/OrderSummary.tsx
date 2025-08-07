import React from "react";
import { CheckCircle, Clock, Video, Users, Award } from "lucide-react";
import Image from "next/image";
import { CourseData } from "./types";

interface OrderSummaryProps {
  courseData: CourseData;
}

/**
 * Order summary component showing course details and pricing
 */
export default function OrderSummary({ courseData }: OrderSummaryProps) {
  const calculateDiscount = () => {
    if (!courseData.originalPrice) return 0;
    return courseData.originalPrice - courseData.price;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

      {/* Course Card */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-4">
          <Image
            src={courseData.image}
            alt={courseData.title}
            width={80}
            height={60}
            className="rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm line-clamp-2">
              {courseData.title}
            </h3>
            <p className="text-muted-foreground text-xs mt-1">
              by {courseData.instructor.name}
            </p>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          <span>{courseData.duration} total duration</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Video className="w-4 h-4 mr-2" />
          <span>{courseData.lessons} video lessons</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          <span>{courseData.students.toLocaleString()} students enrolled</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Award className="w-4 h-4 mr-2" />
          <span>Certificate of completion</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Course Price</span>
          <span className="text-foreground">৳{courseData.originalPrice || courseData.price}</span>
        </div>
        {courseData.originalPrice && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-green-600">-৳{calculateDiscount()}</span>
          </div>
        )}
        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">৳{courseData.price}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground text-sm">What's included:</h4>
        <ul className="space-y-2">
          {courseData.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
