"use client";

import { useState, useEffect } from "react";
import { getRealtorListingStats } from "@/api/dashboard.api";
import { getProperties } from "@/api/property.api";

export function ListingStats() {
  const [stats, setStats] = useState([
    { name: "Active Listings", value: 0 },
    { name: "Pending Sales", value: 0 },
    { name: "Closed Sales (This Month)", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListingStats = async () => {
      try {
        setLoading(true);
        const [statsData, propertiesData] = await Promise.all([
          getRealtorListingStats(),
          getProperties() // Get all agent properties to count stats in case API fails
        ]);
        
        if (statsData && Object.keys(statsData).length > 0) {
          // Use data from the specific listing stats API if available
          setStats([
            { name: "Active Listings", value: statsData.activeListings || 0 },
            { name: "Pending Sales", value: statsData.pendingSales || 0 },
            { name: "Closed Sales (This Month)", value: statsData.closedSales || 0 },
          ]);
        } else if (propertiesData && propertiesData.properties) {
          // Fall back to calculating stats from properties data
          const properties = propertiesData.properties;
          const activeCount = properties.filter(p => p.status === "active").length;
          const pendingCount = properties.filter(p => p.status === "pending").length;
          const soldCount = properties.filter(p => p.status === "sold").length;
          
          setStats([
            { name: "Active Listings", value: activeCount },
            { name: "Pending Sales", value: pendingCount },
            { name: "Closed Sales (This Month)", value: soldCount },
          ]);
        }
      } catch (error) {
        console.error("Error fetching listing stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListingStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
        Listing Stats
      </h2>
      <ul className="space-y-4">
        {loading ? (
          stats.map((stat) => (
            <li key={stat.name} className="flex justify-between items-center">
              <span>{stat.name}</span>
              <div className="h-5 w-10 bg-gray-200 animate-pulse rounded"></div>
            </li>
          ))
        ) : (
          stats.map((stat) => (
            <li key={stat.name} className="flex justify-between items-center">
              <span>{stat.name}</span>
              <span className="font-bold text-[#E74C3C]">{stat.value}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
