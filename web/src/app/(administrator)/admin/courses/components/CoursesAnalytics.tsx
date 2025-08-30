"use client";
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { ArrowUpRight, ArrowDownRight, Trophy } from "lucide-react";

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

  const cardClass = "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4";

  // Derived metrics for compact footers
  const enrollmentSeries = lineData.datasets[0].data as number[];
  const enrollmentTotal = enrollmentSeries.reduce((a, b) => a + b, 0);
  const enrollmentMoM = enrollmentSeries[enrollmentSeries.length - 1] - enrollmentSeries[enrollmentSeries.length - 2];
  const bestMonthIndex = enrollmentSeries.indexOf(Math.max(...enrollmentSeries));

  const revenueSeries = barData.datasets[0].data as number[];
  const revenueYtd = revenueSeries.reduce((a, b) => a + b, 0);
  const revenueMoM = revenueSeries[revenueSeries.length - 1] - revenueSeries[revenueSeries.length - 2];
  const avgRevenuePerMonth = Math.round(revenueYtd / revenueSeries.length);

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrollments Trend</h3>
          <span className="text-xs text-gray-400">Last 12 months</span>
        </div>
        <Line data={lineData} options={lineOptions} height={80} />
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{enrollmentTotal}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${enrollmentMoM >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
              {enrollmentMoM >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {Math.abs(enrollmentMoM)} MoM
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Best: <span className="font-medium text-gray-800 dark:text-gray-200">{months[bestMonthIndex]}</span>
            </p>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h3>
          <span className="text-xs text-gray-400">This year</span>
        </div>
        <Bar data={barData} options={barOptions} height={80} />
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">YTD</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(revenueYtd)}</p>
          </div>
          <div className="flex items-center">
            <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${revenueMoM >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
              {revenueMoM >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {formatCurrency(Math.abs(revenueMoM))} MoM
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg / month</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{formatCurrency(avgRevenuePerMonth)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
