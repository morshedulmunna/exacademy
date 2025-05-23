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
  );
}
