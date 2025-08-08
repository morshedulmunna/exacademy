import React from "react";

interface SimpleChartProps {
  title: string;
  data: { label: string; value: number }[];
  type?: "bar" | "line";
  height?: number;
}

/**
 * Enhanced Simple Chart Component
 * Modern design with improved styling and better visual appeal
 * Displays basic charts without external dependencies
 */
export default function SimpleChart({ title, data, type = "bar", height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className="relative" style={{ height: `${height}px` }}>
        {type === "bar" ? (
          <div className="flex items-end justify-between h-full space-x-3">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-300 dark:hover:to-indigo-300 hover:shadow-lg"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: "8px",
                  }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative h-full">
            <svg className="w-full h-full" viewBox={`0 0 100 ${height}`}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" />
              ))}

              {/* Line chart */}
              <polyline fill="none" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={data.map((item, index) => `${(index / (data.length - 1)) * 100},${100 - (item.value / maxValue) * 100}`).join(" ")} />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>

              {/* Data points */}
              {data.map((item, index) => (
                <circle key={index} cx={(index / (data.length - 1)) * 100} cy={100 - (item.value / maxValue) * 100} r="4" className="fill-white dark:fill-gray-800 stroke-blue-500 dark:stroke-blue-400 stroke-2" />
              ))}
            </svg>

            {/* Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
              {data.map((item, index) => (
                <span key={index} className="transform -translate-x-1/2">
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
