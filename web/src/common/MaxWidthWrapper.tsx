import React, { ReactNode } from "react";

type MaxWidthWrapperProps = {
  children: ReactNode;
  className?: string;
};

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({ children, className }) => {
  return <div className={`mx-auto px-4 2xl:px-4 max-w-screen-xl ${className}`}>{children}</div>;
};

export default MaxWidthWrapper;
