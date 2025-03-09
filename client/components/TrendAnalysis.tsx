"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChartComponent } from "./ChartComponent";

export function TrendAnalysis() {
  const [metric, setMetric] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [trendData, setTrendData] = useState<any>(null);

  const metrics = ["Sales", "Listings", "Revenue", "User Engagement"];
  const timeRanges = [
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
    "Last year",
  ];

  const handleAnalyze = () => {
    // In a real application, you would fetch the trend data from your API
    setTrendData({
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: metric,
          data: [65, 59, 80, 81, 56, 55],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAnalyze}>Analyze Trend</Button>
      </div>
      {trendData && <ChartComponent type="line" data={trendData} />}
    </div>
  );
}
