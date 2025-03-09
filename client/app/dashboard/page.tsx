"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { WelcomeSection } from "@/components/WelcomeSection";
import { QuickStats } from "@/components/QuickStats";
import { ActivityFeed } from "@/components/ActivityFeed";
import { RecommendedProperties } from "@/components/RecommendedProperties";
import { SavedSearches } from "@/components/SavedSearches";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { ListingStats } from "@/components/ListingStats";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<"seeker" | "realtor">("seeker");

  useEffect(() => {
    if (user?.role === "buyer" || user?.role === "renter") {
      setUserType("seeker");
    } else if (user?.role) {
      setUserType("realtor");
    }
  }, [user?.role]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar userType={userType} />
      <main className="flex-1 p-8">
        <WelcomeSection userName={user?.firstName} />
        <QuickStats userType={userType} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <ActivityFeed />
          <RecommendedProperties />
        </div>
        {userType === "seeker" && <SavedSearches />}
        {userType === "realtor" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <PerformanceMetrics />
            <ListingStats />
          </div>
        )}
      </main>
    </div>
  );
}
