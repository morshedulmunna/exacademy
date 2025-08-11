"use client";

import { useId } from "react";
import { useTheme } from "@/themes/ThemeProvider";

type RatingViewProps = {
  ratingPercentage?: number; // Accepts rating in percentage (0 to 100)
};

export function RatingView({ ratingPercentage = 0 }: RatingViewProps) {
  const numberOfStars = 5; // Total number of stars
  const rating = (ratingPercentage / 100) * numberOfStars; // Convert percentage to a rating scale
  const uniqueId = useId(); // Generate a unique ID for gradients
  const { theme } = useTheme();

  // Define colors based on theme
  const filledColor = "#ffc107"; // Yellow for filled stars
  const emptyColor = theme === "dark" ? "#6b7280" : "#d1d5db"; // Gray for empty stars

  return (
    <div className="flex items-center">
      <span className="pr-1 text-yellow-500 text-sm">{rating.toFixed(1)}</span>

      {[...Array(numberOfStars)].map((_, index) => {
        const fillPercentage =
          rating >= index + 1
            ? 100 // Full star
            : rating > index
            ? (rating - index) * 100 // Partial star
            : 0; // Empty star

        return (
          <label key={index}>
            <input type="radio" name="rating" value={rating} style={{ display: "none" }} readOnly />
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }}>
              <defs>
                <linearGradient id={`grad-${uniqueId}-${index}`}>
                  <stop offset={`${fillPercentage}%`} stopColor={filledColor} />
                  <stop offset={`${fillPercentage}%`} stopColor={emptyColor} />
                  <stop offset="100%" stopColor={emptyColor} />
                </linearGradient>
              </defs>
              <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.253L12 18.897l-7.417 4.626L6 15.27 0 9.423l8.332-1.268z" fill={`url(#grad-${uniqueId}-${index})`} />
            </svg>
          </label>
        );
      })}
    </div>
  );
}
