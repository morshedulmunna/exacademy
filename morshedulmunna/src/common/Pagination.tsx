"use client";

import { useEffect, useState } from "react";

interface PaginationProps {
  numberOfData: number;
  limits: number;
  activePage: number;
  className?: string;
  getCurrentPage?: (page: number) => void;
  [key: string]: unknown;
}

const Pagination: React.FC<PaginationProps> = ({
  numberOfData,
  limits,
  className,
  getCurrentPage,
  activePage = 1,
  ...props
}) => {
  const [numberOfPage, setNumberOfPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(activePage);

  useEffect(() => {
    if (numberOfData < limits) {
      setNumberOfPage(1);
    } else {
      setNumberOfPage(Math.ceil(numberOfData / limits));
    }
  }, [numberOfData, limits]);

  const setLimitHandler = (index: number) => {
    setCurrentPage(index + 1);
    if (getCurrentPage) {
      getCurrentPage(index + 1);
    }
  };

  const getDisplayedPages = () => {
    const maxButtonsToShow = 5;
    let pages: number[] = [];

    if (numberOfPage <= maxButtonsToShow) {
      for (let i = 1; i <= numberOfPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 5) {
        pages = [1, 2, 3, 4, 5];
      } else if (currentPage > numberOfPage - 4) {
        pages = [
          numberOfPage - 4,
          numberOfPage - 3,
          numberOfPage - 2,
          numberOfPage - 1,
          numberOfPage,
        ];
      } else {
        pages = [
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
        ];
      }
    }

    return pages;
  };

  return (
    <div {...props} className={`flex justify-start ${className}`}>
      <div className="flex flex-wrap gap-y-1 items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setLimitHandler(currentPage - 2)}
          className={`border dark:border-gray-800 hover:border hover:border-gray-300 transition-all ease-in-out bg-transparent px-3 gap-2 py-1.5 flex justify-center items-center rounded-md ${
            currentPage === 1 && "opacity-50"
          } `}
        >
          {/* <svg
            width="14"
            height="13"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_245_565)">
              <path
                d="M16 8.5H1"
                stroke="#051B44"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 3.5L1 8.5L6 13.5"
                stroke="#051B44"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_245_565">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg> */}
          <p className="font-medium text-xs lg:text-sm">Prev</p>
        </button>

        {currentPage > 5 && numberOfPage > 5 && (
          <button
            onClick={() => setLimitHandler(0)}
            className={`border dark:border-gray-800 h-8 w-8 flex flex-wrap justify-center items-center rounded-md text-xs lg:text-sm font-medium ${
              currentPage === 1 ? "bg-primary text-white" : "bg-transparent"
            }`}
          >
            1
          </button>
        )}
        {currentPage > 5 && numberOfPage > 5 && (
          <span className="border dark:border-gray-800 h-8 w-8 flex flex-wrap justify-center items-center rounded-md text-xs lg:text-sm font-medium bg-transparent">
            ...
          </span>
        )}

        {getDisplayedPages().map((each) => (
          <button
            key={each}
            onClick={() => setLimitHandler(each - 1)}
            className={`border dark:border-gray-800 h-8 w-8 flex flex-wrap justify-center items-center rounded-md text-xs lg:text-sm font-medium ${
              currentPage === each
                ? " bg-primary-base border-none text-white "
                : "bg-transparent"
            }`}
          >
            {each}
          </button>
        ))}

        {currentPage <= numberOfPage - 5 && numberOfPage > 5 && (
          <span className="border dark:border-gray-800 h-8 w-8 flex flex-wrap justify-center items-center rounded-md text-xs lg:text-sm font-medium bg-transparent">
            ...
          </span>
        )}
        {currentPage <= numberOfPage - 5 && numberOfPage > 5 && (
          <button
            onClick={() => setLimitHandler(numberOfPage - 1)}
            className={`border dark:border-gray-800 h-8 w-8 flex flex-wrap justify-center items-center rounded-md text-xs lg:text-sm font-medium ${
              currentPage === numberOfPage
                ? "bg-primary text-white"
                : "bg-transparent"
            }`}
          >
            {numberOfPage}
          </button>
        )}

        <button
          disabled={numberOfPage <= 1 || numberOfPage === currentPage}
          onClick={() => setLimitHandler(currentPage)}
          className={`border dark:border-gray-800 hover:border hover:border-gray-300 transition-all ease-in-out bg-transparent px-4 py-1.5 gap-2 flex justify-center items-center rounded-md text-xs lg:text-sm ${
            (numberOfPage <= 1 || numberOfPage === currentPage) && "opacity-50"
          }`}
        >
          <p className="font-medium text-xs lg:text-sm">Next</p>
          {/* <svg
            width="14"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 8.5H15.5"
              stroke="#051B44"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 3.5L15.5 8.5L10.5 13.5"
              stroke="#051B44"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
