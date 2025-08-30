"use client";
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

interface CoursesAnalyticsProps {
  totalRevenue: number;
}

/**
 * CoursesAnalytics
 * Minimal, modern analytics overview with three small charts.
 */
export const CoursesAnalytics: React.FC<CoursesAnalyticsProps> = ({ totalRevenue }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Enrollments",
        data: [12, 19, 13, 15, 22, 30, 28, 35, 40, 38, 45, 50],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode: "index" as const, intersect: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { stepSize: 10 } } },
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 2400, 1800, 3000, 2600, totalRevenue / 10],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: "rgba(0,0,0,0.05)" } } },
  };

  const doughnutData = {
    labels: ["Web", "Frontend", "Backend", "Design", "JavaScript"],
    datasets: [
      {
        data: [32, 24, 18, 16, 10],
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const cardClass = "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrollments Trend</h3>
          <span className="text-xs text-gray-400">Last 12 months</span>
        </div>
        <Line data={lineData} options={lineOptions} height={80} />
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h3>
          <span className="text-xs text-gray-400">This year</span>
        </div>
        <Bar data={barData} options={barOptions} height={80} />
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</h3>
          <span className="text-xs text-gray-400">Distribution</span>
        </div>
        <div className="max-w-[220px] mx-auto">
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};
