"use client";

import { useEffect, useState } from "react";

export default function CursorLaser() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPrevPos(pos); // Store old position before updating
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pos]);

  // Calculate angle and distance between prev and current pos
  const dx = pos.x - prevPos.x;
  const dy = pos.y - prevPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[9999]">
      {/* Cursor Glow */}
      <div
        style={{
          position: "absolute",
          top: pos.y,
          left: pos.x,
          width: isClicked ? "40px" : "16px",
          height: isClicked ? "40px" : "16px",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#00ffff",
          filter: isClicked ? "blur(12px) brightness(2)" : "blur(6px) brightness(1.3)",
          borderRadius: "9999px",
          opacity: 0.9,
          transition: "all 80ms ease-out",
        }}
      />

      {/* Laser Line */}
      {isClicked && (
        <div
          style={{
            position: "absolute",
            top: prevPos.y,
            left: prevPos.x,
            width: `${distance}px`,
            height: "2px",
            background: "linear-gradient(to right, #00ffff, transparent)",
            transform: `rotate(${angle}deg)`,
            transformOrigin: "0 0",
            opacity: 0.8,
            pointerEvents: "none",
            filter: "blur(2px) drop-shadow(0 0 4px #00ffff)",
            transition: "all 50ms ease-out",
          }}
        />
      )}
    </div>
  );
}
