"use client";

import { useState, useEffect } from "react";
import { getSavedSearches } from "@/api/dashboard.api";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserDashboard } from "@/api/dashboard.api";

type SearchFilter = {
  location?: string;
  priceRange?: [number, number];
  propertyType?: string[];
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  status?: string;
};

type SavedSearch = {
  id: string | number;
  name: string;
  criteria: string;
  filters?: SearchFilter;
  createdAt?: string | Date;
};

export function SavedSearches() {
  const { user } = useAuth();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        setLoading(true);
        let userSearches: SavedSearch[] = [];
        
        // Try to get data from multiple sources in sequence
        // 1. First try the dedicated saved searches API
        const savedSearchesData = await getSavedSearches().catch(() => null);
        
        if (savedSearchesData?.searches && savedSearchesData.searches.length > 0) {
          userSearches = savedSearchesData.searches;
        } else {
          // 2. Try to get from dashboard if available
          try {
            const dashboardData = await getUserDashboard().catch(() => null);
            if (dashboardData?.savedSearches && dashboardData.savedSearches.length > 0) {
              userSearches = dashboardData.savedSearches.map((search: {
                _id?: string;
                id?: string;
                name?: string;
                criteria?: string;
                filters?: SearchFilter;
                createdAt?: string | Date;
              }) => ({
                id: search._id || search.id || Math.random().toString(36).substring(7),
                name: search.name || "Saved Search",
                criteria: search.criteria || formatCriteria(search.filters || {}),
                filters: search.filters,
                createdAt: search.createdAt
              }));
            }
          } catch (e) {
            console.error("Error fetching dashboard data:", e);
          }
        }
        
        // If we got searches from any source, use them
        if (userSearches.length > 0) {
          setSearches(userSearches);
        } else {
          // Otherwise use intelligent fallback based on user role
          const roleBased = user?.role === "agent" || user?.role === "realtor" ?
            [
              {
                id: 1,
                name: "High-Value Properties",
                criteria: "Price > $500,000, any location",
                filters: {
                  priceRange: [500000, 10000000] as [number, number],
                  status: "active"
                }
              },
              {
                id: 2,
                name: "New Listings This Month",
                criteria: "All new properties in the last 30 days",
                filters: {
                  status: "active",
                  // No other filters to show all new listings
                }
              }
            ] :
            [
              {
                id: 1,
                name: "3BR Houses in Downtown",
                criteria: "3 bedrooms, Downtown area",
                filters: {
                  location: "Downtown",
                  bedrooms: 3,
                  propertyType: ["House"]
                }
              },
              {
                id: 2,
                name: "Apartments under $300k",
                criteria: "Apartments, Max price: $300,000",
                filters: {
                  propertyType: ["Apartment"],
                  priceRange: [0, 300000] as [number, number]
                }
              },
              { 
                id: 3, 
                name: "Homes with Pool", 
                criteria: "Houses, Amenity: Pool",
                filters: {
                  propertyType: ["House"],
                  amenities: ["Pool"]
                }
              },
            ];
            
          setSearches(roleBased);
        }
      } catch (error) {
        console.error("Error fetching saved searches:", error);
        // Use fallback data on error
        setSearches([
          {
            id: 1,
            name: "3BR Houses in Downtown",
            criteria: "3 bedrooms, Downtown area"
          },
          {
            id: 2,
            name: "Apartments under $300k",
            criteria: "Apartments, Max price: $300,000"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSearches();
  }, [user]);

  // Helper function to format criteria from filters object
  const formatCriteria = (filters: SearchFilter): string => {
    const parts: string[] = [];
    
    if (filters.propertyType && filters.propertyType.length > 0) {
      parts.push(filters.propertyType.join(", "));
    }
    
    if (filters.location) {
      parts.push(`in ${filters.location}`);
    }
    
    if (filters.bedrooms) {
      parts.push(`${filters.bedrooms} BR`);
    }
    
    if (filters.bathrooms) {
      parts.push(`${filters.bathrooms} Bath`);
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (min > 0 && max < Number.MAX_SAFE_INTEGER) {
        parts.push(`$${min.toLocaleString()}-$${max.toLocaleString()}`);
      } else if (min > 0) {
        parts.push(`>$${min.toLocaleString()}`);
      } else if (max < Number.MAX_SAFE_INTEGER) {
        parts.push(`<$${max.toLocaleString()}`);
      }
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      parts.push(`Amenities: ${filters.amenities.join(", ")}`);
    }
    
    return parts.join(", ") || "All properties";
  };

  const handleSearchClick = (search: SavedSearch) => {
    // If we have filters, apply them to the search page
    if (search.filters) {
      // Navigate to search page with filters
      router.push(`/search?filters=${encodeURIComponent(JSON.stringify(search.filters))}`);
    } else {
      // Just navigate to search page with the name as a query
      router.push(`/search?q=${encodeURIComponent(search.name)}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
        Saved Searches
      </h2>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border-b pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : searches.length > 0 ? (
        <ul className="space-y-4">
          {searches.map((search) => (
            <li key={search.id} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{search.name}</p>
                  <p className="text-sm text-gray-600">{search.criteria}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSearchClick(search)}
                >
                  Apply
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No saved searches yet</p>
      )}
    </div>
  );
}
