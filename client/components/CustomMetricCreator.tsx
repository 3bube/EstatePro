"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CustomMetricCreator() {
  const [metricName, setMetricName] = useState("");
  const [formula, setFormula] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("");

  const existingMetrics = ["Sales", "Listings", "Revenue", "User Engagement"];

  const handleAddMetric = () => {
    console.log("Adding custom metric:", { metricName, formula });
    // Here you would typically send this data to your backend to create the custom metric
    // After successful creation, you might want to update the list of available metrics
    setMetricName("");
    setFormula("");
  };

  const handleInsertMetric = () => {
    setFormula((prevFormula) => `${prevFormula}[${selectedMetric}]`);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="metric-name">Metric Name</Label>
        <Input
          id="metric-name"
          value={metricName}
          onChange={(e) => setMetricName(e.target.value)}
          placeholder="Enter custom metric name"
        />
      </div>
      <div>
        <Label htmlFor="formula">Formula</Label>
        <div className="flex space-x-2">
          <Input
            id="formula"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Enter formula (e.g., [Sales] / [Listings])"
          />
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Insert metric" />
            </SelectTrigger>
            <SelectContent>
              {existingMetrics.map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleInsertMetric}>Insert</Button>
        </div>
      </div>
      <Button onClick={handleAddMetric}>Create Custom Metric</Button>
    </div>
  );
}
