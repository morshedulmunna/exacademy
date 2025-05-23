import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import WorkExperienceCard from "./WorkExperienceCard";

type Props = {};

const workExperiences = [
  {
    title: "Senior Software Engineer",
    period: "Sep 2024 - Present",
    company: "TechCorp",

    responsibilities: [
      "Built robust, high-performance microservices using Golang",
      "Architected scalable microservices-based systems",
      "Wrote and maintained Swagger API documentation",
      "Engineered and optimized PostgreSQL databases",
      "Automated CI/CD pipelines and managed deployments",
      "Reviewed code and mentored junior engineers",
      "Managed team of 3-4 interns and fresher developers",
    ],
    skills: ["Golang", "Microservices", "PostgreSQL", "CI/CD", "Swagger", "Team Leadership"],
  },
  {
    title: "Founder & CEO",
    period: "Sep 2024 - Present",
    company: "Teachyst",
    companyLink: "#",
    responsibilities: [
      "Developed and launched a white-labeled NextGen LMS platform",
      "Created a platform for educators and creators",
      "Led product development and strategy",
      "Managed business operations and growth",
    ],
    skills: ["Product Development", "Business Strategy", "Team Leadership", "Platform Architecture", "EdTech"],
  },
];

export default function WorkExperiance({}: Props) {
  return (
    <>
      {/* Work Experience */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
          <p className="text-gray-400">I switch a lot of companies. It's mostly about the culture.</p>
          <div className="border-[1px] w-full rounded-full my-6 border-gray-900/30"></div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-6 md:col-span-2">
              {workExperiences.map((experience, index) => (
                <WorkExperienceCard key={index} {...experience} />
              ))}
            </div>

            {/* Company Branding */}
            <div className="col-span-1">
              <div className="mb-2">
                <h3 className="text-xl font-bold">
                  Founder & CEO{" "}
                  <Link href="#" className="text-cyan-400">
                    @Teachyst
                  </Link>
                </h3>
                <p className="text-gray-400">Sep 2024 - Present</p>
                <p className="text-gray-400 mt-1">India</p>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span className="text-gray-300">White Labeled NextGen LMS</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <span className="text-gray-300">Platform for educators and creators</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
