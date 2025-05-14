"use client";

import { useState, useEffect } from "react";
import { getSavedProperties, getPropertyByUserId } from "@/api/property.api";
import { getRealtorListingStats, getUserDashboard } from "@/api/dashboard.api";

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
          // Attempt to get comprehensive dashboard data first
          const dashboardData = await getUserDashboard().catch(() => null);
          
          if (dashboardData) {
            // Use the dashboard API data if available
            setSavedPropertiesCount(dashboardData.savedProperties?.length || 0);
            setUpcomingVisitsCount(dashboardData.upcomingVisits?.length || 0);
          } else {
            // Fall back to individual API calls
            const savedPropertiesData = await getSavedProperties().catch(() => ({ properties: [] }));
            setSavedPropertiesCount(savedPropertiesData?.properties?.length || 0);
            
            // Try to get upcoming visits from properties with scheduled visits
            try {
              const userVisitsResponse = await fetch("/api/user/visits");
              if (userVisitsResponse.ok) {
                const visitsData = await userVisitsResponse.json();
                setUpcomingVisitsCount(visitsData?.visits?.filter((v: { status: string }) => v.status === "accepted")?.length || 0);
              }
            } catch (e) {
              console.error("Could not fetch visits, using fallback count", e);
              setUpcomingVisitsCount(0);
            }
          }
        } else {
          // For realtors/agents, fetch both listing stats and properties to get the most accurate count
          const [listingStats, propertiesResponse] = await Promise.all([
            getRealtorListingStats().catch(() => ({
              activeListings: 0,
              pendingSales: 0
            })),
            getPropertyByUserId().catch(() => ({ data: [] }))
          ]);
          
          if (listingStats && Object.keys(listingStats).length > 0) {
            // Use the dedicated stats API if available
            setActiveListings(listingStats.activeListings || 0);
            setPendingSales(listingStats.pendingSales || 0);
          } else if (propertiesResponse && propertiesResponse.data) {
            // If stats API fails, calculate from properties data
            const properties = propertiesResponse.data;
            const activeCount = properties.filter((p: { status: string }) => p.status === "active").length;
            const pendingCount = properties.filter((p: { status: string }) => p.status === "pending").length;
            
            setActiveListings(activeCount);
            setPendingSales(pendingCount);
          }
          
          // Also get pending visit requests count for agents
          try {
            const pendingVisits = propertiesResponse.data
              .flatMap((property: { scheduledVisits?: Array<{ status: string }> }) => property.scheduledVisits || [])
              .filter((visit: { status: string }) => visit.status === "pending").length;
              
            // If there are pending visits, update pendingSales to include them
            if (pendingVisits > 0) {
              setPendingSales(prev => prev + pendingVisits);
            }
          } catch (e) {
            console.error("Error calculating pending visits", e);
          }
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
          { name: "Pending Requests", value: pendingSales },
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
