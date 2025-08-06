import React from "react";

type Props = {
  className?: string;
  text?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

export default function ButtonPrimary({
  className = "",
  text = "Click Me",
  onClick,
  icon,
  type = "button",
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-primary hover:bg-primary/90 transition-all ease-in-out font-semibold flex items-center gap-1 text-white py-1 px-2 rounded ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </button>
  );
}
