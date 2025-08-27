import React from "react";
import { CertificateCard } from "./components";

/**
 * Certificates Page
 * Page for learners to view their earned certificates
 */
export default function CertificatesPage() {
  // Mock data for demonstration
  const certificates = [
    {
      id: "cert-001",
      courseTitle: "JavaScript Basics",
      instructor: "Lisa Chen",
      issueDate: "2024-01-10T14:20:00Z",
      certificateUrl: "/api/certificates/cert-001.pdf",
      grade: "A+",
      category: "JavaScript"
    },
    {
      id: "cert-002",
      courseTitle: "HTML Essentials",
      instructor: "Alex Brown",
      issueDate: "2024-01-08T16:30:00Z",
      certificateUrl: "/api/certificates/cert-002.pdf",
      grade: "A",
      category: "HTML"
    },
    {
      id: "cert-003",
      courseTitle: "CSS Fundamentals",
      instructor: "Mike Johnson",
      issueDate: "2024-01-05T11:15:00Z",
      certificateUrl: "/api/certificates/cert-003.pdf",
      grade: "A-",
      category: "CSS"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Certificates</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
        </p>
      </div>
      
      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No certificates yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete courses to earn your first certificate
          </p>
          <a
            href="/dashboard/my-courses"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Courses
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
}
