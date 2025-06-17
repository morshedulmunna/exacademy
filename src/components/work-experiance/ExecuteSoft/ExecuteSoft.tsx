import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

export default function ExecuteSoft({}: Props) {
  return (
    <div>
      <div className="col-span-1">
        <div className="mb-2">
          <h3 className="text-xl font-bold">
            Founder & CEO{" "}
            <Link href="#" className="text-cyan-400">
              @ExecuteSoft
            </Link>
          </h3>
          <p className="text-gray-400">Sep 2022 - Present</p>
          <p className="text-gray-400 mt-1">Dhaka, Bangladesh</p>
        </div>

        <div className="space-y-2 mt-4">
          {[
            "White Labeled NextGen LMS",
            "Platform for educators and creators",
            "Built scalable microservices architecture",
            "Implemented real-time collaboration features",
            "Developed custom analytics dashboard",
            "Integrated payment gateway systems",
            "Created automated testing pipeline",
            "Optimized database performance",
            "Implemented CI/CD workflows",
            "Built RESTful APIs",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-cyan-400 mt-0.5" />
              <span className="text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
