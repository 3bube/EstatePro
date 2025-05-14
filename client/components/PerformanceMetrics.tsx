"use client";

import { useState, useEffect } from "react";
import { getRealtorMetrics } from "@/api/dashboard.api";

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState([
    { name: "Properties Sold", value: 0 },
    { name: "Average Days on Market", value: 0 },
    { name: "Client Satisfaction", value: "0/5" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getRealtorMetrics();
        
        if (data) {
          setMetrics([
            { name: "Properties Sold", value: data.propertiesSold || 0 },
            { name: "Average Days on Market", value: data.averageDaysOnMarket || 0 },
            { name: "Client Satisfaction", value: data.clientSatisfaction || "0/5" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching performance metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
        Performance Metrics
      </h2>
      <ul className="space-y-4">
        {loading ? (
          metrics.map((metric) => (
            <li key={metric.name} className="flex justify-between items-center">
              <span>{metric.name}</span>
              <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
            </li>
          ))
        ) : (
          metrics.map((metric) => (
            <li key={metric.name} className="flex justify-between items-center">
              <span>{metric.name}</span>
              <span className="font-bold text-[#E74C3C]">{metric.value}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
