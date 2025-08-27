import React from "react";
import { Activity, Target } from "lucide-react";
import { ChartCard } from "./ChartCard";

interface ChartData {
  label: string;
  value: number;
}

interface ChartsSectionProps {
  revenueData: ChartData[];
  userGrowthData: ChartData[];
}

/**
 * Charts section component displaying revenue and user growth charts
 */
export const ChartsSection: React.FC<ChartsSectionProps> = ({ revenueData, userGrowthData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <ChartCard
      title="Monthly Revenue"
      subtitle="Trending Up"
      icon={<Activity className="w-4 h-4" />}
      data={revenueData}
    />
    <ChartCard
      title="User Growth"
      subtitle="Steady Growth"
      icon={<Target className="w-4 h-4" />}
      data={userGrowthData}
    />
  </div>
);
