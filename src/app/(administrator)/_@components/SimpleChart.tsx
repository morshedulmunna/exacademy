import React from "react";

interface SimpleChartProps {
  title: string;
  data: { label: string; value: number }[];
  type?: "bar" | "line";
  height?: number;
}

/**
 * Simple Chart Component
 * Displays basic charts without external dependencies
 */
export default function SimpleChart({ title, data, type = "bar", height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="relative" style={{ height: `${height}px` }}>
        {type === "bar" ? (
          <div className="flex items-end justify-between h-full space-x-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gray-300 dark:bg-gray-600 rounded-t transition-all duration-300 hover:bg-gray-400 dark:hover:bg-gray-500"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative h-full">
            <svg className="w-full h-full" viewBox={`0 0 100 ${height}`}>
              <polyline fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-500" points={data.map((item, index) => `${(index / (data.length - 1)) * 100},${100 - (item.value / maxValue) * 100}`).join(" ")} />
              {data.map((item, index) => (
                <circle key={index} cx={(index / (data.length - 1)) * 100} cy={100 - (item.value / maxValue) * 100} r="3" className="fill-gray-600 dark:fill-gray-400" />
              ))}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              {data.map((item, index) => (
                <span key={index}>{item.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
