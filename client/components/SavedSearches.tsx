"use client";

import { useState, useEffect } from "react";
import { getSavedSearches } from "@/api/dashboard.api";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type SavedSearch = {
  id: string | number;
  name: string;
  criteria: string;
  filters?: any;
};

export function SavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        setLoading(true);
        const data = await getSavedSearches();
        
        // If API returns searches, use them; otherwise, use fallback data
        if (data?.searches && data.searches.length > 0) {
          setSearches(data.searches);
        } else {
          // Fallback data
          setSearches([
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
                priceRange: [0, 300000]
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
          ]);
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
  }, []);

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
