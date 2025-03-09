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

export function ComparisonTool() {
  const [metric1, setMetric1] = useState("");
  const [metric2, setMetric2] = useState("");
  const [comparisonData, setComparisonData] = useState<any>(null);

  const metrics = ["Sales", "Listings", "Revenue", "User Engagement"];

  const handleCompare = () => {
    // In a real application, you would fetch the comparison data from your API
    setComparisonData({
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: metric1,
          data: [12, 19, 3, 5, 2, 3],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: metric2,
          data: [7, 11, 5, 8, 3, 7],
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Select value={metric1} onValueChange={setMetric1}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select metric 1" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((metric) => (
              <SelectItem key={metric} value={metric}>
                {metric}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={metric2} onValueChange={setMetric2}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select metric 2" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((metric) => (
              <SelectItem key={metric} value={metric}>
                {metric}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleCompare}>Compare</Button>
      </div>
      {comparisonData && <ChartComponent type="line" data={comparisonData} />}
    </div>
  );
}
