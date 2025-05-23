"use client";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useRef, useState, useEffect } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectionOptionDropdownProps {
  options: Option[];
  onSelect?: (option: Option) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function SelectionOptionDropdown({ options, onSelect, defaultValue = "Select an option", className = "", disabled = false, icon }: SelectionOptionDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [isOpen]);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option);
    }
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={`relative w-full outline-none lg:w-40 inline-block text-left rounded border dark:border-gray-800  ${className}`}>
      <div className="rounded-md outline-none">
        <button
          disabled={disabled}
          type="button"
          className={`flex whitespace-nowrap gap-1 items-center text-xs lg:text-sm   transition-all ease-in-out justify-between w-full rounded-md bg-white dark:bg-background px-4 py-2 font-medium hover:bg-gray-50 focus:outline-none ${
            selectedOption?.label && ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby="listbox-label"
        >
          {icon}

          {selectedOption ? selectedOption.label : defaultValue}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`origin-top-right w-full max-h-[550px] overflow-y-auto z-40 absolute ${
            openUpwards ? "bottom-full mb-1" : "mt-1"
          } rounded-md shadow-lg w-full mt-1 bg-white dark:bg-background border dark:border-gray-800 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1 w-full" role="none">
            {options?.map((option) => (
              <div
                key={option.value}
                className="block w-full whitespace-nowrap capitalize px-4 py-2 text-xs lg:text-sm  transition-all ease-in-out cursor-pointer"
                onClick={() => handleOptionClick(option)}
                role="menuitem"
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
