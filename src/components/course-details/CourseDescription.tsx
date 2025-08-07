import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import React from "react";

type Props = object;

export default function CourseDescription({}: Props) {
  const rawHTML = `
  <div class="dark:text-gray-200 text-gray-700 leading-relaxed">
    <p class="mb-4">
      JavaScript is the obvious next step once you learn HTML and CSS. However, it is super important to learn 
      JavaScript by practicing and fun exercises along the way. This course does exactly that. You will be 
      introduced to core JavaScript concepts and would be allowed to practice them as we progress with the course.
    </p>
    <p class="mb-4">
      This course will introduce you to JS and allow you to use it to add interactivity to your existing 
      HTML/CSS codebase. We will start with basics in this course which includes:
    </p>
    <ul class="list-disc pl-6 mb-4 space-y-2 dark:text-gray-200 text-gray-700">
      <li>Introduction to JavaScript</li>
      <li>How to work with HTML + CSS + JavaScript together</li>
      <li>Building core concepts</li>
      <li>Language syntax</li>
      <li>Writing your first few programs</li>
      <li>Algorithmic practice with JavaScript</li>
      <li>And finally a bunch of projects at the end to solidify your learnings.</li>
    </ul>
    <p class="mb-4">
      This is going to be an interesting and foundational course. All the best!
    </p>
  </div>
`;
  return (
    <>
      <div className="mt-12">
        <MaxWidthWrapper>
          <h3 className="font-bold mb-6 dark:text-white text-gray-900 text-xl">About This Course</h3>
          <div className="prose dark:prose-invert max-w-none prose-headings:dark:text-white prose-headings:text-gray-900 prose-p:dark:text-gray-200 prose-p:text-gray-700 prose-ul:dark:text-gray-200 prose-ul:text-gray-700" dangerouslySetInnerHTML={{ __html: rawHTML }} />
        </MaxWidthWrapper>
      </div>
    </>
  );
}
