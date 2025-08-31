"use client";

import React from "react";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import CourseBuilder from "@/components/course/CourseBuilder";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseBuilderPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="py-6">
      <MaxWidthWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Course Builder</h1>
          <p className="text-sm text-gray-500">Manage modules and lessons for: {slug}</p>
        </div>
        <CourseBuilder onModulesChange={() => {}} className="mb-10" />
      </MaxWidthWrapper>
    </div>
  );
}
