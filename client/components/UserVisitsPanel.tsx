"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserVisits } from "@/api/visits.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import Spinner from "@/components/Spinner";
import Image from "next/image";

// Define types for our component
interface Visit {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  scheduledDate: string;
  status: "pending" | "accepted" | "declined";
  notes?: string;
  createdAt: string;
  user: string;
  propertyType?: string;
  propertyBedrooms?: number;
  propertyBathrooms?: number;
  propertyPrice?: number;
  propertyImage?: string;
}

interface UserVisitsPanelProps {
  isLoading?: boolean;
}

// Helper function to format dates
function formatDate(date: string | Date): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to format time
function formatTime(date: string | Date): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UserVisitsPanel({ isLoading = false }: UserVisitsPanelProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");
  
  // Fetch user visits
  const { data, isLoading: isLoadingVisits, error } = useQuery({
    queryKey: ["user-visits"],
    queryFn: getUserVisits,
  });

  console.log("Visit data:", data);

  // Combine loading states
  const loading = isLoading || isLoadingVisits;
  
  // Process visits based on filter
  const visits = useMemo(() => data?.visits || [] as Visit[], [data]);
  
  // Default to showing accepted visits first if there are any
  useEffect(() => {
    const hasAccepted = visits.some((visit) => visit.status === "accepted");
    if (hasAccepted && filter === "all") {
      setFilter("accepted");
    }
  }, [visits, filter]);
  
  const filteredVisits = useMemo(() => {
    return filter === "all" 
      ? visits 
      : visits.filter((visit) => visit.status === filter);
  }, [visits, filter]);

  // Get counts for each status
  const pendingCount = useMemo(() => visits.filter((visit) => visit.status === "pending").length, [visits]);
  const acceptedCount = useMemo(() => visits.filter((visit) => visit.status === "accepted").length, [visits]);
  const declinedCount = useMemo(() => visits.filter((visit) => visit.status === "declined").length, [visits]);

  // Determine status badge color and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Accepted</Badge>;
      case "declined":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Declined</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p>Error loading your scheduled visits. Please try again later.</p>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
        {visits.length === 0 ? (
          <>
            <p className="text-gray-600 mb-2">You don&apos;t have any scheduled visits yet.</p>
            <p className="text-gray-500">Browse properties and schedule a visit to see them here.</p>
          </>
        ) : (
          <p className="text-gray-500">No {filter !== "all" ? filter : ""} visits found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Your Scheduled Visits</h2>
        
        {/* Status filter tabs */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "all" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setFilter("all")}
          >
            All ({visits.length})
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "pending" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({pendingCount})
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "accepted" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setFilter("accepted")}
          >
            Accepted ({acceptedCount})
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "declined" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setFilter("declined")}
          >
            Declined ({declinedCount})
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>Error loading your scheduled visits. Please try again later.</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredVisits.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          {visits.length === 0 ? (
            <>
              <p className="text-gray-600 mb-2">You don't have any scheduled visits yet.</p>
              <p className="text-gray-500">Browse properties and schedule a visit to see them here.</p>
            </>
          ) : (
            <p className="text-gray-500">No {filter !== "all" ? filter : ""} visits found.</p>
          )}
        </div>
      )}

      {/* Visit cards */}
      {!loading && !error && filteredVisits.length > 0 && (
        <div className="space-y-4">
          {filteredVisits.map((visit) => (
            <Card key={visit._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{visit.propertyTitle}</CardTitle>
                  {getStatusBadge(visit.status)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Property Image */}
                  {visit.propertyImage && (
                    <div className="w-full md:w-1/3 h-32 overflow-hidden rounded-md">
                      <div className="relative w-full h-full">
                        <Image 
                          src={visit.propertyImage} 
                          alt={visit.propertyTitle} 
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Visit Details */}
                  <div className="flex-1 flex flex-col gap-2">
                    {/* Date and Time */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(visit.scheduledDate)} at {formatTime(visit.scheduledDate)}
                      </span>
                    </div>
                    
                    {/* Address */}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{visit.propertyAddress}</span>
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex items-center gap-4 mt-1">
                      {visit.propertyType && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {visit.propertyType.charAt(0).toUpperCase() + visit.propertyType.slice(1)}
                        </span>
                      )}
                      {visit.propertyBedrooms && visit.propertyBedrooms > 0 && (
                        <span className="text-xs text-gray-600">
                          {visit.propertyBedrooms} {visit.propertyBedrooms === 1 ? "Bedroom" : "Bedrooms"}
                        </span>
                      )}
                      {visit.propertyBathrooms && visit.propertyBathrooms > 0 && (
                        <span className="text-xs text-gray-600">
                          {visit.propertyBathrooms} {visit.propertyBathrooms === 1 ? "Bathroom" : "Bathrooms"}
                        </span>
                      )}
                      {visit.propertyPrice && visit.propertyPrice > 0 && (
                        <span className="text-xs font-semibold">
                          ${visit.propertyPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Notes */}
                    {visit.notes && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Notes:</h4>
                        <p className="text-sm text-gray-600">{visit.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {visit.status === "accepted" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md text-green-800 text-sm">
                    <p className="font-medium">Your visit has been confirmed! ✓</p>
                    <p>Please arrive on time for your scheduled appointment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
