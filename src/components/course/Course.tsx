import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

type Props = {};

export default function Course({}: Props) {
  return (
    <>
      {/* Courses */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Courses</h2>
          <p className="text-gray-400 mb-16">Explore a selection of courses designed to help you enhance your skills.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course 1 */}
            <div className="bg-zinc-900 rounded-xl overflow-hidden">
              <div className="h-48 relative">
                <Image src="/docker-course.png" alt="Docker Mastery Course" fill className="object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Docker Mastery Course</h3>
                <p className="text-gray-400 text-sm">
                  In this course, you will learn everything you need to know about Docker, a powerful tool for creating, deploying, and managing containerized applications.
                </p>
                <div className="flex items-center justify-between pt-4">
                  <button aria-label="Like" className="text-gray-500 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 10v12" />
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                  </button>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Course
                  </Button>
                </div>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-zinc-900 rounded-xl overflow-hidden">
              <div className="h-48 relative">
                <Image src="/generic-social-media-interface.png" alt="Full Stack Twitter Clone" fill className="object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Full Stack Twitter Clone</h3>
                <p className="text-gray-400 text-sm">
                  Create a FullStack Twitter Clone that allows users to create and post tweets, follow other users, and like, and view their own profiles and the profiles of other
                  users.
                </p>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-2">
                    <button aria-label="Like" className="text-gray-500 hover:text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                      </svg>
                    </button>
                    <button aria-label="Comment" className="text-gray-500 hover:text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                    <button aria-label="Share" className="text-gray-500 hover:text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Course
                  </Button>
                </div>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-zinc-900 rounded-xl overflow-hidden">
              <div className="h-48 relative">
                <Image src="/placeholder-mw9tv.png" alt="NextJS 14" fill className="object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">NextJS 14</h3>
                <p className="text-gray-400 text-sm">
                  Welcome to "Mastering Next.js 14 Course" a comprehensive course designed to elevate your skills in developing modern web applications using Next.js version 14.
                </p>
                <div className="flex items-center justify-between pt-4">
                  <button aria-label="Like" className="text-gray-500 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </button>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
