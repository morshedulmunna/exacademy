"use client";

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Course Edit Page
 * Form for editing existing courses
 */
export default function EditCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    excerpt: "",
    price: "",
    originalPrice: "",
    duration: "",
    lessons: "",
    thumbnail: "",
    published: false,
    featured: false,
  });

  // Redirect if not authenticated or not admin
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (response.ok) {
          const course = await response.json();
          setFormData({
            title: course.title || "",
            slug: course.slug || "",
            description: course.description || "",
            excerpt: course.excerpt || "",
            price: course.price?.toString() || "",
            originalPrice: course.originalPrice?.toString() || "",
            duration: course.duration || "",
            lessons: course.lessons?.toString() || "",
            thumbnail: course.thumbnail || "",
            published: course.published || false,
            featured: course.featured || false,
          });
          if (course.thumbnail) {
            setThumbnailPreview(course.thumbnail);
          }
        } else {
          setError("Course not found");
        }
      } catch (error) {
        setError("Failed to load course");
      } finally {
        setIsFetching(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
        setFormData((prev) => ({ ...prev, thumbnail: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          lessons: parseInt(formData.lessons) || 0,
        }),
      });

      if (response.ok) {
        router.push("/admin-handler/courses");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setError("Failed to update course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin-handler/courses");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Failed to delete course");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin-handler/courses" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin-handler/courses" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Course</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Update course information and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleDelete} disabled={isLoading} className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors">
            <X className="w-4 h-4" />
            <span>Delete</span>
          </button>
          <button type="submit" form="course-form" disabled={isLoading} className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            <span>{isLoading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="course-url-slug"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will be used in the course URL: /course/{formData.slug}</p>
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Brief description of the course"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Detailed description of what students will learn"
                  />
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 12h 30m"
                  />
                </div>

                <div>
                  <label htmlFor="lessons" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Lessons
                  </label>
                  <input
                    type="number"
                    id="lessons"
                    name="lessons"
                    value={formData.lessons}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail Upload */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Thumbnail</h3>

              {thumbnailPreview ? (
                <div className="relative">
                  <Image src={thumbnailPreview} alt="Course thumbnail" width={300} height={200} className="w-full h-48 object-cover rounded-lg" />
                  <button type="button" onClick={removeThumbnail} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500">Upload thumbnail</span>
                    </label>
                    <input id="thumbnail-upload" name="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>

            {/* Course Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Publish Course
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Make this course visible to students</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.published ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.published ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleInputChange} className="sr-only" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured Course
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Highlight this course on the homepage</p>
                  </div>
                  <button type="button" onClick={() => setFormData((prev) => ({ ...prev, featured: !prev.featured }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.featured ? "bg-yellow-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.featured ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="sr-only" />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${formData.published ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>{formData.published ? "Published" : "Draft"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${formData.price || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formData.duration || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lessons:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formData.lessons || "0"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
