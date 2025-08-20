"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const animFrame = useRef(0);

  useEffect(() => {
    const updateGlow = () => {
      const glow = glowRef.current;
      if (glow) {
        glow.style.left = `${posRef.current.x}px`;
        glow.style.top = `${posRef.current.y}px`;
      }
      animFrame.current = requestAnimationFrame(updateGlow);
    };

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 200);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);
    animFrame.current = requestAnimationFrame(updateGlow);

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          width: clicked ? "40px" : "18px",
          height: clicked ? "40px" : "18px",
          borderRadius: "9999px",
          backgroundColor: "#00ffff",
          filter: clicked ? "blur(20px) brightness(2)" : "blur(6px) brightness(1.5)",
          opacity: 0.5,
          transition: `
            width 150ms ease,
            height 150ms ease,
            filter 150ms ease
          `,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
