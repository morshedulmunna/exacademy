"use client";

// DynamicAccordion.tsx
import React, { useState } from "react";

type AccordionItem = {
  title: React.ReactElement | string;
  content: React.ReactElement | string;
};

type AccordionProps = {
  items: AccordionItem[];
};

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  // Maintain an array of open indices
  const [activeIndices, setActiveIndices] = useState<number[]>(() => items.map((_, index) => index));

  const toggleAccordion = (index: number) => {
    if (activeIndices.includes(index)) {
      // Remove index if it is already active
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      // Add index if it is not active
      setActiveIndices([...activeIndices, index]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {items.map((item, index) => (
        <div key={index}>
          {/* Accordion Header */}
          <button onClick={() => toggleAccordion(index)} className="flex justify-between items-center w-full p-4 focus:outline-none">
            <div>{item.title}</div>
            <svg className={`w-3 h-3 transform transition-transform duration-300 ${activeIndices.includes(index) ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Accordion Content */}
          <div className={`overflow-hidden  transition-[max-height] duration-500 ease-in-out ${activeIndices.includes(index) ? "max-h-screen" : "max-h-0"}`}>
            <div className="py-2 ml-4 ">
              {/* bg-gray-800 */}
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
