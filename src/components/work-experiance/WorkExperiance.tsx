import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import WorkExperienceCard from "./WorkExperienceCard";
import ExecuteSoft from "./ExecuteSoft/ExecuteSoft";

type Props = {};

const workExperiences = [
  {
    title: "Senior Software Engineer",
    period: "April 2025 - Present",
    company: "Tutorsplan",
    companyLink: "https://www.tutorsplan.com/",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/D4E0BAQGqbWufNfCf1Q/company-logo_200_200/company-logo_200_200/0/1718275079682/tutorsplan_logo?e=1753315200&v=beta&t=dY25nFvm2Vt776GwpgCkanTicoNfqjoxEvAFqtvyxvw",
    responsibilities: [
      "Built scalable microservices in Node.js/Golang, improving system performance and reducing server response time by 30%",
      "Deployed scalable architectures that supported a 2x increase in user traffic without downtime",
      "Created and maintained Swagger/OpenAPI documentation, reducing developer onboarding time by 40%",
      "Tuned PostgreSQL queries and indexing strategies, cutting average query response time from 500ms to under 100ms",
      "CI/CD pipelines using GitHub Actions and Kubernetes, reducing deployment time by 50% and improving uptime reliability",
      "Optimized Docker images, reducing image size by 60% through multistage builds and removing unnecessary dependencies",
      "Orchestrated service discovery, horizontal scaling, and zero-downtime deployments that improved system availability by 99.9%",
      "Implemented resource limits, health checks, and autoscaling in Kubernetes to reduce infrastructure cost by 25%",
      "Supervised 3–4 junior developers and interns, leading to 2 promotions within the team",
    ],
    skills: [
      "Golang",
      "Microservices",
      "PostgreSQL",
      "CI/CD",
      "Swagger",
      "Team Leadership",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "NestJS",
      "React.js",
      "Next.js",
      "Docker",
      "Kubernetes",
      "VPS",
      "AWS",
      "MongoDB",
      "Redis",
      "Elasticsearch",
    ],
  },
  {
    title: "Software Engineer",
    period: "December 2023 - April 2025",
    company: "Pakiza Software Limited",
    companyLink: "https://pakizasoftware.com/",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/D560BAQEfipty4vqHxw/company-logo_200_200/company-logo_200_200/0/1697871364420/pakizasoftware_logo?e=1753315200&v=beta&t=NqdigyOy5AIv--NVcvcwunh9p5VQAn_qP0-tG_NKz_I",
    responsibilities: [
      "Implemented user posting, timelines, stories, reels, and pages with performance optimizations that enabled smooth infinite scrolling, increasing user engagement by 25%",
      "Developed social media features (timelines, reels, stories) enabling smooth infinite scrolling with < 100ms render time",
      "Improved user engagement metrics by 25% via performance optimization and new features (like, comment, share)",
      "Supervised code reviews and merges on GitHub, leading to a 30% reduction in bugs post-deployment and successfully deploying the application to production on schedule",
      "Spearheaded production deployment in DigitalOcean Droplets, increasing app reliability and uptime to 99.9%",
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "Node.js",
      "NestJS",
      "React.js",
      "Next.js",
      "Golang",
      "Docker",
      "Kubernetes",
      "VPS",
      "AWS",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "Elasticsearch",
    ],
  },
  {
    title: "Software Engineer/ Full Stack Developer",
    period: "December 2023 - February 2024",
    company: "Studio Dev Hub",
    companyLink: "https://studiodevhub.com/",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/D560BAQFPFLXflguv-Q/company-logo_200_200/company-logo_200_200/0/1735906408155/greenpantsstudio_logo?e=1753315200&v=beta&t=7QjY3qMbVsqateoh_W7-N6_3VmSPMioVUvvhMMJ_DhI",
    responsibilities: [
      "Built a SaaS data management solution using Typesense handling 2M+ records with search latency under 60ms",
      "Implemented search features such as: Search-as-you-type, Semantic Search, Autocomplete, Recommendations",
      "Successfully managed a dataset of 2 million records, ensuring search latency remained under 60ms",
      "Improved user satisfaction by 30% based on feedback through optimized search functionality",
    ],
    skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "Node.js", "NestJS", "Docker", "MongoDB", "PostgreSQL", "Redis", "Elasticsearch", "Typesense"],
  },
  {
    title: " Associate Software Engineer",
    period: "March 2023 - November 2023",
    company: "Possier.com",
    companyLink: "https://possier.com/",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/C4D0BAQF3Hu_VWbYPog/company-logo_200_200/company-logo_200_200/0/1630550457090/possier_logo?e=1753315200&v=beta&t=7_EWVInqroHRrsfvfIwEoytoPQAhMjV3HyRgwUD0onI",
    responsibilities: [
      "Built responsive web applications implementing SSR, CSR, ISR, and SSG with optimized performance metrics",
      "Integrated RESTful APIs and GraphQL endpoints for efficient data flow and seamless functionality",
      "Managed application state using Redux and Context API to maintain efficient state management, reducing app crashes by 10%",
      "Optimized SSR implementation for faster load times and improved SEO rankings",
    ],
    skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "Node.js", "NestJS", "Docker", "MongoDB", "PostgreSQL", "Redis", "Elasticsearch", "Typesense"],
  },
  {
    title: "Associate Software Engineer",
    period: "February 2022 - January 2023",
    company: "Axios Byte",
    companyLink: "https://biztechsolutions.com/",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/D560BAQHPQwkiJZSA4A/company-logo_200_200/company-logo_200_200/0/1693415429733/axios_byte_logo?e=1753315200&v=beta&t=k3TgJN9CE9to16o8zVZ0q399xCfY27TpHyK7X8wc-Wc",
    responsibilities: [
      "Implemented dynamic components with code splitting and lazy loading, reducing initial bundle size by 45%",
      "Optimized image loading with WebP format and CDN caching, improving LCP by 2.9s",
      "Enhanced performance through tree shaking and minification, reducing JS/CSS bundle size by 60%",
      "Achieved 91 Page Speed score by implementing performance optimizations across the application",
    ],
    skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "Node.js", "NestJS", "Docker", "MongoDB", "PostgreSQL", "Redis", "Elasticsearch", "Typesense"],
  },
];

export default function WorkExperiance({}: Props) {
  return (
    <>
      {/* Work Experience */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
          <p className="text-gray-400">
            My passion for technology drives me to continually learn and stay up-to-date with the latest industry trends. I approach every project with a critical and creative
            mindset, analyzing problems and finding innovative solutions.
          </p>
          <div className="border-[1px] w-full rounded-full my-6 border-gray-900/30"></div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              {workExperiences.map((experience, index) => (
                <WorkExperienceCard key={index} {...experience} />
              ))}
            </div>

            {/* Company Branding */}
            <ExecuteSoft />
          </div>
        </div>
      </section>
    </>
  );
}
