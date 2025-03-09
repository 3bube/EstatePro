"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

interface FilterSidebarProps {
  onFilterChange?: (filters: Partial<FilterState>) => void;
  filters?: FilterState;
}

export function FilterSidebar({
  onFilterChange,
  filters = {
    location: "",
    priceRange: [0, 1000000],
    propertyType: [],
    bedrooms: 0,
    bathrooms: 0,
    areaRange: [0, 5000],
    yearBuilt: 1900,
    amenities: [],
  },
}: FilterSidebarProps) {
  const [location, setLocation] = useState(filters.location);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange
  );
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    filters.propertyType
  );
  const [bedrooms, setBedrooms] = useState(filters.bedrooms);
  const [bathrooms, setBathrooms] = useState(filters.bathrooms);
  const [areaRange, setAreaRange] = useState<[number, number]>(
    filters.areaRange
  );
  const [yearBuilt, setYearBuilt] = useState(filters.yearBuilt);
  const [amenities, setAmenities] = useState<string[]>(filters.amenities);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when filters prop changes
  useEffect(() => {
    setLocation(filters.location);
    setPriceRange(filters.priceRange);
    setPropertyTypes(filters.propertyType);
    setBedrooms(filters.bedrooms);
    setBathrooms(filters.bathrooms);
    setAreaRange(filters.areaRange);
    setYearBuilt(filters.yearBuilt);
    setAmenities(filters.amenities);
  }, [filters]);

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    let updatedTypes: string[];
    if (checked) {
      updatedTypes = [...propertyTypes, type];
    } else {
      updatedTypes = propertyTypes.filter((t) => t !== type);
    }
    setPropertyTypes(updatedTypes);
    setIsDirty(true);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    let updatedAmenities: string[];
    if (checked) {
      updatedAmenities = [...amenities, amenity];
    } else {
      updatedAmenities = amenities.filter((a) => a !== amenity);
    }
    setAmenities(updatedAmenities);
    setIsDirty(true);
  };

  const resetFilters = () => {
    setLocation("");
    setPriceRange([0, 1000000]);
    setPropertyTypes([]);
    setBedrooms(0);
    setBathrooms(0);
    setAreaRange([0, 5000]);
    setYearBuilt(1900);
    setAmenities([]);
    setIsDirty(true);
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        location,
        priceRange,
        propertyType: propertyTypes,
        bedrooms,
        bathrooms,
        areaRange,
        yearBuilt,
        amenities,
      });
    }
    setIsDirty(false);
  };

  return (
    <aside className="w-full md:w-64 space-y-4 bg-white p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, ZIP, or Neighborhood"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setIsDirty(true);
          }}
        />
      </div>

      <div>
        <Label>Price Range</Label>
        <Slider
          min={0}
          max={1000000}
          step={10000}
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value as [number, number]);
            setIsDirty(true);
          }}
        />
        <div className="flex justify-between text-sm">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div>
        <Label>Property Type</Label>
        <div className="space-y-2">
          {["House", "Apartment", "Condo", "Townhouse"].map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={`type-${type}`}
                checked={propertyTypes.includes(type)}
                onCheckedChange={(checked) =>
                  handlePropertyTypeChange(type, checked === true)
                }
              />
              <label htmlFor={`type-${type}`} className="ml-2 text-sm">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input
          id="bedrooms"
          type="number"
          min={0}
          value={bedrooms}
          onChange={(e) => {
            setBedrooms(Number.parseInt(e.target.value) || 0);
            setIsDirty(true);
          }}
        />
      </div>

      <div>
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input
          id="bathrooms"
          type="number"
          min={0}
          step={0.5}
          value={bathrooms}
          onChange={(e) => {
            setBathrooms(Number.parseFloat(e.target.value) || 0);
            setIsDirty(true);
          }}
        />
      </div>

      <div>
        <Label>Square Footage</Label>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={areaRange}
          onValueChange={(value) => {
            setAreaRange(value as [number, number]);
            setIsDirty(true);
          }}
        />
        <div className="flex justify-between text-sm">
          <span>{areaRange[0]} sqft</span>
          <span>{areaRange[1]} sqft</span>
        </div>
      </div>

      <div>
        <Label>Amenities</Label>
        <div className="space-y-2">
          {["Parking", "Pool", "Gym", "Elevator", "Balcony"].map((amenity) => (
            <div key={amenity} className="flex items-center">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={amenities.includes(amenity)}
                onCheckedChange={(checked) =>
                  handleAmenityChange(amenity, checked === true)
                }
              />
              <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="year-built">Year Built (After)</Label>
        <Input
          id="year-built"
          type="number"
          min={1900}
          max={new Date().getFullYear()}
          value={yearBuilt}
          onChange={(e) => {
            setYearBuilt(Number.parseInt(e.target.value) || 1900);
            setIsDirty(true);
          }}
        />
      </div>

      <div className="flex space-x-2 mt-6">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>
          Reset
        </Button>
        <Button className="flex-1" onClick={applyFilters} disabled={!isDirty}>
          Apply
        </Button>
      </div>
    </aside>
  );
}
