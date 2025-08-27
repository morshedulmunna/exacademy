import React from "react";
import { Clock, Target, TrendingUp } from "lucide-react";
import { MetricCard } from "./MetricCard";

/**
 * Key metrics component displaying grid of performance indicators
 */
export const KeyMetrics: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <MetricCard icon={<Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />} title="Average Session" value="24m 32s" change="+12% from last month" bgColor="bg-blue-100 dark:bg-blue-900/20" textColor="text-blue-600 dark:text-blue-400" />
    <MetricCard icon={<Target className="w-8 h-8 text-green-600 dark:text-green-400" />} title="Conversion Rate" value="3.2%" change="+0.8% from last month" bgColor="bg-green-100 dark:bg-green-900/20" textColor="text-green-600 dark:text-green-400" />
    <MetricCard icon={<TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />} title="Growth Rate" value="18.5%" change="+2.1% from last month" bgColor="bg-purple-100 dark:bg-purple-900/20" textColor="text-purple-600 dark:text-purple-400" />
  </div>
);
