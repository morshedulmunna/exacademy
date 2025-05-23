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
            <div className="flex items-center gap-3">
              {icon || (
                <div className="bg-zinc-800 w-10 h-10  rounded-md">
                  <img src={companyLogo} alt={company} width={40} height={40} />
                </div>
              )}
              <div className="flex justify-start flex-col">
                <p className="text-gray-400 group-hover:text-cyan-400 text-lg transition-all ease-linear duration-300">{title}</p>
                <Link target="_blank" href={companyLink || "#"} className="text-cyan-400 w-fit hover:underline text-start text-xs">
                  {company}
                </Link>
                <p className="text-gray-400 text-start text-xs">{period}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 ml-4 md:ml-12 space-y-1 text-sm">
              {responsibilities.map((responsibility, index) => (
                <p key={index} className="text-sm text-gray-400">
                  • {responsibility}
                </p>
              ))}
            </div>

            <div className="mt-4 ml-4 md:ml-12">
              <h4 className="text-sm text-gray-400 group-hover:text-white font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-zinc-800 text-gray-400 group-hover:text-white group-hover:bg-zinc-700 transition-all ease-linear font-medium duration-300 rounded-md text-xs"
                  >
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
