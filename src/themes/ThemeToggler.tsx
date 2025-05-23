"use client";

import { useTheme } from "./ThemeProvider";

const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="p-2 rounded-lg  text-gray-900 dark:text-gray-100 focus:outline-none "
    >
      {theme === "light" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm5.657 2.343a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414L15.657 5.757a1 1 0 010-1.414zM10 16a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm5.657 1.657a1 1 0 011.414-1.414l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414zm-11.314 0a1 1 0 00-1.414 1.414L3.343 19.07a1 1 0 001.414-1.414l-1.414-1.414zM10 4a6 6 0 100 12 6 6 0 000-12z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 4.25a.75.75 0 01.75.75V6a.75.75 0 01-1.5 0V5a.75.75 0 01.75-.75zm0 8.5a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5zm0-7.5a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm6.364 6.136a.75.75 0 011.06 0l1.25 1.25a.75.75 0 11-1.06 1.06l-1.25-1.25a.75.75 0 010-1.06z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggler;
