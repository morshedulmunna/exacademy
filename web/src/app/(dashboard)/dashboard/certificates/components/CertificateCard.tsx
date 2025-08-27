import React from "react";
import { Award, Download, Share2, Calendar } from "lucide-react";

interface Certificate {
  id: string;
  courseTitle: string;
  instructor: string;
  issueDate: string;
  certificateUrl: string;
  grade?: string;
  category: string;
}

interface CertificateCardProps {
  certificate: Certificate;
}

/**
 * Certificate card component for displaying earned certificates
 */
export const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <Award className="w-8 h-8 text-white" />
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
        <a
          href={certificate.certificateUrl}
          download
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
    
    <div className="mb-4">
      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full mb-3">
        {certificate.category}
      </span>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {certificate.courseTitle}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Instructor: {certificate.instructor}
      </p>
    </div>
    
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
      <div className="flex items-center space-x-1">
        <Calendar className="w-4 h-4" />
        <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
      </div>
      {certificate.grade && (
        <span className="font-medium text-gray-900 dark:text-white">
          Grade: {certificate.grade}
        </span>
      )}
    </div>
    
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">
        Certificate ID: {certificate.id}
      </span>
      <a
        href={certificate.certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Certificate
      </a>
    </div>
  </div>
);
