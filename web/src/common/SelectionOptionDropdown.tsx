"use client";

import { useState, useRef, useEffect } from "react";

// Define option interface
interface Option {
  label: string;
  value: string | number;
}

// Define props interface for the dropdown component
interface SelectionOptionDropdownProps {
  options: Option[];
  onSelect?: (option: Option) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  buttonClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function SelectionOptionDropdown({
  options,
  onSelect,
  defaultValue = "Select an option",
  className = "",
  disabled = false,
  icon,
  buttonClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  onOpen,
  onClose,
}: SelectionOptionDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  // Adjust dropdown position based on available space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      setOpenUpwards(
        spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height
      );
    }
  }, [isOpen]);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onSelect?.(option);
    setIsOpen(false);
    onClose?.();
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isOpen ? onClose?.() : onOpen?.();
  };

  return (
    <div
      ref={buttonRef}
      className={`relative inline-block w-full lg:w-40 text-left ${className}`}
    >
      {/* Dropdown trigger button */}
      <button
        disabled={disabled}
        type="button"
        className={`flex items-center justify-between w-full gap-1 px-4 py-2 text-sm font-medium bg-white border rounded-md dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 focus:outline-none ${buttonClassName}`}
        onClick={handleToggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon}
        {selectedOption ? selectedOption.label : defaultValue}
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 w-full max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 ${
            openUpwards ? "bottom-full mb-1" : "top-full mt-1"
          } ${dropdownClassName}`}
          role="listbox"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${optionClassName}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selectedOption?.value === option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
