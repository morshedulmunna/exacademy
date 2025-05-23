"use client";
import { useEffect, RefObject } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

export const useOnClickOutside = (
  ref: RefObject<HTMLDivElement | null>,
  handler: Handler
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event?.target as Node | null)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
