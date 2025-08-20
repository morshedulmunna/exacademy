import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import React from "react";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

type Props = {
  description: string;
};

export default function CourseDescription({ description }: Props) {
  return (
    <>
      <div className="mt-12">
        <MaxWidthWrapper>
          <h3 className="font-bold mb-6 dark:text-white text-gray-900 text-xl">About This Course</h3>
          <MarkdownRenderer content={description} className="prose-headings:dark:text-white prose-headings:text-gray-900 prose-p:dark:text-gray-200 prose-p:text-gray-700 prose-ul:dark:text-gray-200 prose-ul:text-gray-700" />
        </MaxWidthWrapper>
      </div>
    </>
  );
}
