"use client";

import React, { useEffect, useState } from "react";
import { getProperties } from "@/api/property.api";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

// Define types for our property data
interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number;
}

interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  address: PropertyAddress;
  features: PropertyFeatures;
  type?: string;
  status?: string;
}

// Mapped property type to match what PropertyCard and PropertyGrid expect
interface MappedProperty {
  _id: string;
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  sqft: number; // Added for PropertyGrid compatibility
  image?: string;
  images?: string[];
  address: string;
  type?: string; // Added for property type filtering
}

export default function HomePage() {
  const [properties, setProperties] = useState<MappedProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<MappedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [featuredProperties, setFeaturedProperties] = useState<MappedProperty[]>([]);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        
        // Map properties to the expected format
        const mappedProperties = data.map((property: Property) => ({
          _id: property._id,
          id: property._id,
          title: property.title,
          price: property.price,
          bedrooms: property.features.bedrooms,
          bathrooms: property.features.bathrooms,
          area: property.features.area,
          sqft: property.features.area, // Map area to sqft for compatibility
          images: property.images,
          image: (property.images && property.images.length > 0) ? property.images[0] : "", // Will be handled with fallback in the UI
          address: `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`,
          type: property.type
        }));
        
        setProperties(mappedProperties);
        setFilteredProperties(mappedProperties);
        
        // Set featured properties (e.g., top 3 most expensive)
        const featured = [...mappedProperties]
          .sort((a, b) => b.price - a.price)
          .slice(0, 3);
        setFeaturedProperties(featured);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties when search criteria change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...properties];
      
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          property => 
            property.title.toLowerCase().includes(term) || 
            property.address.toLowerCase().includes(term)
        );
      }
      
      // Apply price range filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        filtered = filtered.filter(property => {
          if (max) {
            return property.price >= min && property.price <= max;
          }
          return property.price >= min;
        });
      }
      
      // Apply property type filter if implemented in the backend
      if (propertyType !== "all" && properties.some(p => p.type)) {
        filtered = filtered.filter(
          property => property.type === propertyType
        );
      }
      
      setFilteredProperties(filtered);
    };
    
    applyFilters();
  }, [searchTerm, priceRange, propertyType, properties]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle price range selection
  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value);
  };

  // Handle property type selection
  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
  };

  // Render loading skeletons
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/3 mb-3" />
                  <div className="flex justify-between mt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="mb-6 text-red-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-[#2C3E50]" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Discover the perfect property that fits your lifestyle and budget
          </p>
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                type="text"
                placeholder="Search by location or property name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-grow text-black"
              />
              <Button className="bg-[#2C3E50] hover:bg-[#1a2530]">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <Link href={`/property/${property._id}`} key={property._id}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  {property.image ? (
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-white font-medium">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-[#2C3E50] text-white px-3 py-1 m-2 rounded">
                    Featured
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <CardDescription>{property.address}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold text-[#2C3E50] mb-2">
                    ${property.price?.toLocaleString()}
                  </p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.area?.toLocaleString()} sqft</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Property Listings with Filters */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Available Properties</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select value={priceRange} onValueChange={handlePriceRangeChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-100000">Under $100,000</SelectItem>
                <SelectItem value="100000-300000">$100,000 - $300,000</SelectItem>
                <SelectItem value="300000-500000">$300,000 - $500,000</SelectItem>
                <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
                <SelectItem value="1000000-">$1,000,000+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <PropertyGrid properties={filteredProperties.map(p => ({
            _id: p._id,
            title: p.title,
            price: p.price,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            sqft: p.sqft,
            image: p.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 300 200' preserveAspectRatio='none'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3C/svg%3E",
            address: p.address
          }))} />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria to find more properties.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setPriceRange("all");
                setPropertyType("all");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-[#2C3E50] text-white rounded-lg p-8 mt-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Contact our team of real estate experts to help you find your perfect property
        </p>
        <Button 
          className="bg-white text-[#2C3E50] hover:bg-gray-100"
          asChild
        >
          <Link href="/contact">Contact Us</Link>
        </Button>
      </section>
    </div>
  );
}