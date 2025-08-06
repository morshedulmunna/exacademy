"use client";

import { useEffect, useState, ReactNode } from "react";

interface NavbarScrollingWrapperProps {
  children: ReactNode;
}

export default function NavbarScrollingWrapper({
  children,
}: NavbarScrollingWrapperProps) {
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, prevScrollPos]);

  return (
    <nav
      className={`sticky z-[500] top-0 left-0 w-full transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {children}
    </nav>
  );
}
