import React from "react";
import Link from "next/link";
import CourseCard from "./CourseCard";
// Backend removed; display with no courses

type Props = {
  page?: number;
  perPage?: number;
};

export default async function Course({ page = 1, perPage = 6 }: Props) {
  // Dummy course data
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      slug: "web-development-bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch. Build real-world projects and become a full-stack developer.",
      excerpt: "Master modern web development with hands-on projects",
      thumbnail: "",
      duration: "48 hours",
      lessons: 48,
      price: 299,
      original_price: 599,
      instructorName: "Sarah Johnson",
      instructorAvatar: "",
      instructorTitle: "Senior Full-Stack Developer",
      instructorBio: "10+ years experience in web development, former Google engineer",
      rating: 4.8,
      reviews: 2847,
      isBestseller: true,
      lastUpdated: "2024-12-15",
      studentsEnrolled: 15420,
      courseCategory: "Web Development",
      difficultyLevel: "All Levels",
      learningOutcomes: ["Master HTML, CSS, and JavaScript fundamentals", "Build responsive websites and web applications", "Learn modern frameworks like React and Node.js", "Deploy applications to production environments"],
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      slug: "data-science-fundamentals",
      description: "Introduction to data science, statistics, Python programming, and machine learning algorithms for beginners.",
      excerpt: "Start your journey in data science and analytics",
      thumbnail: "",
      duration: "32 hours",
      lessons: 32,
      price: 199,
      original_price: 399,
      instructorName: "Dr. Michael Chen",
      instructorAvatar: "",
      instructorTitle: "PhD in Computer Science",
      instructorBio: "Research scientist at Stanford, published 50+ papers in ML",
      rating: 4.9,
      reviews: 1956,
      isBestseller: true,
      lastUpdated: "2024-11-20",
      studentsEnrolled: 8920,
      courseCategory: "Data Science",
      difficultyLevel: "Beginner",
      learningOutcomes: ["Master Python programming for data analysis", "Learn statistical analysis and visualization", "Build machine learning models and algorithms", "Understand data preprocessing and feature engineering"],
    },
    {
      id: 3,
      title: "Mobile App Development with React Native",
      slug: "react-native-mobile-development",
      description: "Build cross-platform mobile applications using React Native. Learn to create apps for both iOS and Android.",
      excerpt: "Create mobile apps that work on all platforms",
      thumbnail: "",
      duration: "40 hours",
      lessons: 40,
      price: 249,
      original_price: 499,
      instructorName: "Alex Rodriguez",
      instructorAvatar: "",
      instructorTitle: "Mobile App Architect",
      instructorBio: "Built apps used by 10M+ users, ex-Facebook developer",
      rating: 4.7,
      reviews: 3421,
      isBestseller: false,
      lastUpdated: "2024-10-05",
      studentsEnrolled: 12340,
      courseCategory: "Mobile Development",
      difficultyLevel: "Intermediate",
      learningOutcomes: ["Build cross-platform mobile applications", "Master React Native development", "Deploy apps to iOS and Android stores", "Implement native device features and APIs"],
    },
    {
      id: 4,
      title: "Advanced JavaScript Concepts",
      slug: "advanced-javascript",
      description: "Deep dive into JavaScript ES6+, async programming, design patterns, and advanced concepts for experienced developers.",
      excerpt: "Master advanced JavaScript techniques and patterns",
      thumbnail: "",
      duration: "24 hours",
      lessons: 24,
      price: 149,
      original_price: 299,
      instructorName: "Emily Watson",
      instructorAvatar: "",
      instructorTitle: "JavaScript Expert & Author",
      instructorBio: "Author of 'Modern JavaScript Patterns', 15+ years experience",
      rating: 4.6,
      reviews: 1234,
      isBestseller: false,
      lastUpdated: "2024-09-15",
      studentsEnrolled: 5670,
      courseCategory: "Programming",
      difficultyLevel: "Advanced",
      learningOutcomes: ["Master advanced JavaScript concepts", "Learn ES6+ features and modern patterns", "Build scalable applications with best practices", "Understand async programming and design patterns"],
    },
    {
      id: 5,
      title: "UI/UX Design Masterclass",
      slug: "ui-ux-design-masterclass",
      description: "Learn user interface and user experience design principles. Create beautiful, functional, and user-friendly designs.",
      excerpt: "Design interfaces that users love to interact with",
      thumbnail: "",
      duration: "36 hours",
      lessons: 36,
      price: 179,
      original_price: 359,
      instructorName: "David Kim",
      instructorAvatar: "",
      instructorTitle: "Creative Director & UX Lead",
      instructorBio: "Award-winning designer, worked with Apple and Airbnb",
      rating: 4.8,
      reviews: 2156,
      isBestseller: true,
      lastUpdated: "2024-12-01",
      studentsEnrolled: 9870,
      courseCategory: "Design",
      difficultyLevel: "Intermediate",
      learningOutcomes: ["Master UI/UX design principles", "Create beautiful and functional interfaces", "Learn user research and prototyping", "Design for accessibility and usability"],
    },
    {
      id: 6,
      title: "DevOps and CI/CD Pipeline",
      slug: "devops-cicd-pipeline",
      description: "Master DevOps practices, Docker, Kubernetes, and continuous integration/deployment pipelines for modern software development.",
      excerpt: "Streamline your development workflow with DevOps",
      thumbnail: "",
      duration: "42 hours",
      lessons: 42,
      price: 229,
      original_price: 459,
      instructorName: "Lisa Thompson",
      instructorAvatar: "",
      instructorTitle: "DevOps Engineer & Cloud Architect",
      instructorBio: "Certified AWS Solutions Architect, 8+ years in infrastructure",
      rating: 4.5,
      reviews: 987,
      isBestseller: false,
      lastUpdated: "2024-08-30",
      studentsEnrolled: 3450,
      courseCategory: "DevOps",
      difficultyLevel: "Intermediate",
      learningOutcomes: ["Master DevOps practices and tools", "Set up CI/CD pipelines and automation", "Deploy applications with Docker and Kubernetes", "Implement infrastructure as code and monitoring"],
    },
  ];

  const meta = {
    page: page,
    per_page: perPage,
    total_pages: Math.ceil(courses.length / perPage),
    total_count: courses.length,
  };

  return (
    <>
      {/* Courses */}
      <section className="py-20 ">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Courses</h2>
          <p className="text-muted-foreground mb-16">Explore a selection of courses designed to help you enhance your skills.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {courses.length === 0 && <p className="text-muted-foreground">No courses available right now.</p>}
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description}
                excerpt={course.excerpt ?? undefined}
                thumbnail={course.thumbnail ?? undefined}
                duration={course.duration}
                lessons={course.lessons}
                price={course.price}
                originalPrice={course.original_price ?? undefined}
                instructorName={course.instructorName}
                instructorAvatar={course.instructorAvatar}
                instructorTitle={course.instructorTitle}
                instructorBio={course.instructorBio}
                rating={course.rating}
                reviews={course.reviews}
                isBestseller={course.isBestseller}
                lastUpdated={course.lastUpdated}
                studentsEnrolled={course.studentsEnrolled}
                courseCategory={course.courseCategory}
                difficultyLevel={course.difficultyLevel}
                learningOutcomes={course.learningOutcomes}
              />
            ))}
          </div>
          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              {meta.page > 1 ? (
                <Link aria-label="Previous page" className="px-4 py-2 rounded-md border border-border hover:bg-accent text-foreground" href={`/?page=${meta.page - 1}&per_page=${meta.per_page}`}>
                  ← Previous
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-md border border-border text-muted-foreground cursor-not-allowed">← Previous</span>
              )}
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.total_pages}
              </span>
              {meta.page < meta.total_pages ? (
                <Link aria-label="Next page" className="px-4 py-2 rounded-md border border-border hover:bg-accent text-foreground" href={`/?page=${meta.page + 1}&per_page=${meta.per_page}`}>
                  Next →
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-md border border-border text-muted-foreground cursor-not-allowed">Next →</span>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
