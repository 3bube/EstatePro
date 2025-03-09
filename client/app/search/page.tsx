"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PropertyGrid } from "@/components/PropertyGrid";
import { PropertyList } from "@/components/PropertyList";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProperties } from "@/api/property.api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Define a type for the API response properties
export type ApiProperty = {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  address:
    | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      }
    | string;
  propertyType: string;
  yearBuilt: number;
  amenities: string[];
  description: string;
  latitude: number;
  longitude: number;
};

// Define a type for the component properties
export type ComponentProperty = {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  address: string;
  propertyType?: string;
  yearBuilt?: number;
  amenities?: string[];
  description?: string;
  latitude?: number;
  longitude?: number;
};

// For backward compatibility
export type Property = ApiProperty;

type ViewMode = "grid" | "list" | "map";

type FilterState = {
  location: string;
  priceRange: [number, number];
  propertyType: string[];
  bedrooms: number;
  bathrooms: number;
  areaRange: [number, number];
  yearBuilt: number;
  amenities: string[];
};

export default function PropertySearchPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOption, setSortOption] = useState("newest");
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<ApiProperty[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    priceRange: [0, 1000000],
    propertyType: [],
    bedrooms: 0,
    bathrooms: 0,
    areaRange: [0, 5000],
    yearBuilt: 1900,
    amenities: [],
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  // Fetch properties on initial load
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    if (properties.length > 0) {
      applyFiltersAndSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery, sortOption]);

  // Update pagination when filtered properties change
  useEffect(() => {
    // Reset page when filters change
    setPage(1);
  }, [filters, searchQuery]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      // Ensure data is an array
      const propertiesArray = Array.isArray(data)
        ? data
        : data && data.properties
        ? data.properties
        : [];

      console.log("Properties array:", propertiesArray);
      setProperties(propertiesArray);
      setFilteredProperties(propertiesArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
      // Initialize with empty array on error
      setProperties([]);
      setFilteredProperties([]);
    }
  };

  const applyFiltersAndSearch = () => {
    // Ensure properties is an array before spreading
    if (!Array.isArray(properties)) {
      setFilteredProperties([]);
      setHasMore(false);
      return;
    }

    console.log("Applying filters:", filters);
    console.log("Search query:", searchQuery);

    let result = [...properties];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      console.log("Filtering by search query:", query);
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query) ||
          (typeof property.address === "object" &&
            property.address?.city?.toLowerCase().includes(query)) ||
          (typeof property.address === "object" &&
            property.address?.state?.toLowerCase().includes(query)) ||
          (typeof property.address === "object" &&
            property.address?.zipCode?.toLowerCase().includes(query)) ||
          (typeof property.address === "string" &&
            property.address.toLowerCase().includes(query))
      );
      console.log("After search query filter:", result.length);
    }

    // Apply location filter
    if (filters.location) {
      const locationQuery = filters.location.toLowerCase();
      console.log("Filtering by location:", locationQuery);
      result = result.filter(
        (property) =>
          (typeof property.address === "object" &&
            property.address?.city?.toLowerCase().includes(locationQuery)) ||
          (typeof property.address === "object" &&
            property.address?.state?.toLowerCase().includes(locationQuery)) ||
          (typeof property.address === "object" &&
            property.address?.zipCode?.toLowerCase().includes(locationQuery)) ||
          (typeof property.address === "string" &&
            property.address.toLowerCase().includes(locationQuery))
      );
      console.log("After location filter:", result.length);
    }

    // Apply price range filter
    if (
      filters.priceRange &&
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000)
    ) {
      console.log("Filtering by price range:", filters.priceRange);
      result = result.filter(
        (property) =>
          property.price >= filters.priceRange[0] &&
          property.price <= filters.priceRange[1]
      );
      console.log("After price filter:", result.length);
    }

    // Apply property type filter
    if (filters.propertyType && filters.propertyType.length > 0) {
      console.log("Filtering by property type:", filters.propertyType);
      result = result.filter((property) =>
        filters.propertyType.includes(property.propertyType)
      );
      console.log("After property type filter:", result.length);
    }

    // Apply bedrooms filter
    if (filters.bedrooms > 0) {
      console.log("Filtering by bedrooms:", filters.bedrooms);
      result = result.filter(
        (property) => property.bedrooms >= filters.bedrooms
      );
      console.log("After bedrooms filter:", result.length);
    }

    // Apply bathrooms filter
    if (filters.bathrooms > 0) {
      console.log("Filtering by bathrooms:", filters.bathrooms);
      result = result.filter(
        (property) => property.bathrooms >= filters.bathrooms
      );
      console.log("After bathrooms filter:", result.length);
    }

    // Apply square footage filter
    if (
      filters.sqftRange &&
      (filters.sqftRange[0] > 0 || filters.sqftRange[1] < 5000)
    ) {
      console.log("Filtering by sqft range:", filters.sqftRange);
      result = result.filter(
        (property) =>
          property.sqft >= filters.sqftRange[0] &&
          property.sqft <= filters.sqftRange[1]
      );
      console.log("After sqft filter:", result.length);
    }

    // Apply year built filter
    if (filters.yearBuilt > 1900) {
      console.log("Filtering by year built:", filters.yearBuilt);
      result = result.filter(
        (property) => property.yearBuilt >= filters.yearBuilt
      );
      console.log("After year built filter:", result.length);
    }

    // Apply amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      console.log("Filtering by amenities:", filters.amenities);
      result = result.filter((property) =>
        filters.amenities.every((amenity) =>
          property.amenities.includes(amenity)
        )
      );
      console.log("After amenities filter:", result.length);
    }

    // Apply sorting
    if (sortOption === "newest") {
      // Assuming newer properties have higher IDs or there's a date field
      result.sort((a, b) => b._id.localeCompare(a._id));
    } else if (sortOption === "price-high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "price-low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    console.log("Final filtered properties:", result.length);
    setFilteredProperties(result);
    setHasMore(result.length > page * 9);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset pagination when search changes
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    console.log("Filter changed:", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset pagination when filters change
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Get paginated properties
  const paginatedProperties = Array.isArray(filteredProperties)
    ? filteredProperties.slice(0, page * 9)
    : [];

  // Adapter function to ensure properties have the right format for components
  const adaptPropertiesToComponents = (
    properties: ApiProperty[]
  ): ComponentProperty[] => {
    return properties.map((property) => {
      // Create a formatted address string if it's an object
      let addressString = "";
      if (typeof property.address === "object") {
        addressString = `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`;
      } else if (typeof property.address === "string") {
        addressString = property.address;
      }

      return {
        _id: property._id,
        title: property.title,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        image:
          property.images && property.images.length > 0
            ? property.images[0]
            : "/placeholder.svg",
        address: addressString,
        propertyType: property.propertyType,
        yearBuilt: property.yearBuilt,
        amenities: property.amenities,
        description: property.description,
        latitude: property.latitude,
        longitude: property.longitude,
      };
    });
  };

  // Adapter function to ensure properties have the right format for MapView
  const adaptPropertiesForMap = (properties: ApiProperty[]) => {
    return properties.map((property) => {
      // Create a formatted address string if it's an object
      let addressString = "";
      if (typeof property.address === "object") {
        addressString = `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`;
      } else if (typeof property.address === "string") {
        addressString = property.address;
      }

      return {
        _id: property._id,
        title: property.title,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        image:
          property.images && property.images.length > 0
            ? property.images[0]
            : "/placeholder.svg",
        address: addressString,
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
      };
    });
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-col md:flex-row mt-4 gap-4">
        <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-high-low">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="price-low-high">
                  Price: Low to High
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
              >
                Map
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                No properties found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <>
              {viewMode === "grid" && (
                <PropertyGrid
                  properties={adaptPropertiesToComponents(paginatedProperties)}
                />
              )}
              {viewMode === "list" && (
                <PropertyList
                  properties={adaptPropertiesToComponents(paginatedProperties)}
                />
              )}
              {viewMode === "map" && (
                <MapView
                  properties={adaptPropertiesForMap(paginatedProperties)}
                />
              )}

              {hasMore && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
