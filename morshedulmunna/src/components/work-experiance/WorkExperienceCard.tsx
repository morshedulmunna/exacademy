import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/work-experiance/card";
import Link from "next/link";
import Image from "next/image";

interface WorkExperienceCardProps {
  title: string;
  period: string;
  company: string;
  companyLink?: string;
  companyLogo?: string;
  responsibilities: string[];
  skills: string[];
  icon?: React.ReactNode;
}

export default function WorkExperienceCard({ title, period, company, companyLogo, companyLink, responsibilities, skills, icon }: WorkExperienceCardProps) {
  return (
    <Card className="border-none bg-transparent">
      <Accordion type="single" collapsible className="w-full group">
        <AccordionItem value={title.toLowerCase().replace(/\s+/g, "-")} className="border-none">
          <AccordionTrigger className="hover:no-underline outline-none">
            <div className="flex items-start gap-2 sm:gap-3 w-full">
              {icon || (
                <div className="bg-zinc-800 w-8 h-8 sm:w-10 sm:h-10 mt-2 rounded-md flex-shrink-0">
                  <img src={companyLogo} alt={company} className="w-full h-full object-contain " />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <p className="text-gray-400 group-hover:text-cyan-400 whitespace-pre-wrap text-start text-sm sm:text-base truncate transition-all ease-linear duration-300">{title}</p>
                <Link target="_blank" href={companyLink || "#"} className="text-cyan-400 w-fit hover:underline text-start text-xs sm:text-sm truncate">
                  {company}
                </Link>
                <p className="text-gray-400 text-start text-xs sm:text-sm">{period}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 ml-2 sm:ml-4 md:ml-12 space-y-1">
              {responsibilities.map((responsibility, index) => (
                <p key={index} className="text-xs sm:text-sm text-gray-400">
                  • {responsibility}
                </p>
              ))}
            </div>

            <div className="mt-4 ml-2 sm:ml-4 md:ml-12">
              <h4 className="text-xs sm:text-sm text-gray-400 group-hover:text-white font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-zinc-800 text-gray-400 group-hover:text-white group-hover:bg-zinc-700 transition-all ease-linear font-medium duration-300 rounded-md text-[10px] sm:text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
