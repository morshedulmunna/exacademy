"use server";

/**
 * Server action to delete a course
 * @param courseId - The ID of the course to delete
 * @returns Promise<{ success: boolean; message: string }>
 */
export async function deleteCourse(courseId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Course deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete course:", error);
    return {
      success: false,
      message: "Failed to delete course",
    };
  }
}
