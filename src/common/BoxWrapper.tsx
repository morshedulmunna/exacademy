import React, { ReactNode, HTMLProps } from "react";

interface BoxWrapperProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const BoxWrapper: React.FC<BoxWrapperProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={`shadow-sm border border-gray-200 dark:border-gray-700 rounded p-[2px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default BoxWrapper;
