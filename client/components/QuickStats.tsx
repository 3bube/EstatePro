"use client";

import { useState, useEffect } from "react";
import { getSavedProperties } from "@/api/property.api";
import { getRealtorListingStats } from "@/api/dashboard.api";

type QuickStatsProps = {
  userType: "seeker" | "realtor";
};

export function QuickStats({ userType }: QuickStatsProps) {
  const [savedPropertiesCount, setSavedPropertiesCount] = useState(0);
  const [upcomingVisitsCount, setUpcomingVisitsCount] = useState(0);
  const [activeListings, setActiveListings] = useState(0);
  const [pendingSales, setPendingSales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (userType === "seeker") {
          // Fetch saved properties count
          const savedPropertiesData = await getSavedProperties();
          setSavedPropertiesCount(savedPropertiesData?.properties?.length || 0);
          
          // For now, we'll use a placeholder for upcoming visits
          setUpcomingVisitsCount(3);
        } else {
          // Fetch realtor listing stats
          const listingStats = await getRealtorListingStats();
          setActiveListings(listingStats?.activeListings || 0);
          setPendingSales(listingStats?.pendingSales || 0);
        }
      } catch (error) {
        console.error("Error fetching quick stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userType]);

  const stats =
    userType === "seeker"
      ? [
          { name: "Saved Properties", value: savedPropertiesCount },
          { name: "Upcoming Visits", value: upcomingVisitsCount },
        ]
      : [
          { name: "Active Listings", value: activeListings },
          { name: "Pending Sales", value: pendingSales },
        ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#2C3E50]">{stat.name}</h2>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <p className="text-3xl font-bold text-[#E74C3C] mt-2">{stat.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
