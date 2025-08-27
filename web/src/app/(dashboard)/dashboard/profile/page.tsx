import React, { useState } from "react";
import { ProfileHeader, ProfileForm } from "./components";

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
  };

  const handleSave = (data: any) => {
    console.log("Saving profile data:", data);
    // Handle profile update logic here
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />

      {isEditing ? (
        <ProfileForm user={user} onSave={handleSave} />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
            <button onClick={() => setIsEditing(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>

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
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {user.website}
              </a>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <p className="text-gray-900 dark:text-white">{user.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
