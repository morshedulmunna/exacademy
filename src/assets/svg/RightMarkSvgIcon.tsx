import React from "react";

type Props = object;

export default function RightMarkSvgIcon({}: Props) {
  return (
    <>
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        className="inline flex-shrink-0 text-2xl dark:text-white text-green-800"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
      </svg>
    </>
  );
}
