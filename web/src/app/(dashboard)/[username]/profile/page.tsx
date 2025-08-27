"use client";

import React, { useState } from "react";
import { ProfileHeader, ProfileForm } from "./components";
import { BadgeCheck, Calendar, MapPin, Globe, Phone, Mail, User, Award, BookOpen, CheckCircle } from "lucide-react";

/**
 * Profile Page
 * Page for learners to view and edit their profile information
 */
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data for demonstration
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: undefined,
    joinDate: "2024-01-01T00:00:00Z",
    totalCourses: 5,
    completedCourses: 2,
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    website: "https://johndoe.dev",
    bio: "Passionate web developer learning new technologies every day. Love building user-friendly applications and solving complex problems.",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    achievements: ["First Course Completed", "Perfect Score", "Helpful Contributor"],
  };

  const handleSave = (data: any) => {
    console.log("Saving profile data:", data);
    // Handle profile update logic here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen  rounded-md">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Profile & settings</h1>
        </div>

        <div className="space-y-8">
          <ProfileHeader user={user} />

          {isEditing ? (
            <ProfileForm user={user} onSave={handleSave} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information Card */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h2>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <p className="text-gray-900 dark:text-white">{user.name}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <p className="text-gray-900 dark:text-white">{user.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <p className="text-gray-900 dark:text-white">{user.phone}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                        <p className="text-gray-900 dark:text-white">{user.location}</p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline">
                          {user.website}
                        </a>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                        <p className="text-gray-900 dark:text-white leading-relaxed">{user.bio}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button onClick={() => setIsEditing(true)} className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-sm font-medium">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Cards */}
              <div className="space-y-6">
                {/* Skills Card */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Skills</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Learning Stats Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Learning Progress</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{user.totalCourses}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{user.completedCourses}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{user.totalCourses > 0 ? Math.round((user.completedCourses / user.totalCourses) * 100) : 0}%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    </div>
                  </div>
                </div>

                {/* Member Since Card */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Member Since</h3>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {new Date(user.joinDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
