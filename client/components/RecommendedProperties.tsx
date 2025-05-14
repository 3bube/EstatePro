"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getRecommendedProperties } from "@/api/dashboard.api";

type Property = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  images?: string[];
};

export function RecommendedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendedProperties = async () => {
      try {
        setLoading(true);
        const data = await getRecommendedProperties();
        
        // If API returns properties, use them; otherwise, use fallback data
        if (data?.properties && data.properties.length > 0) {
          setProperties(data.properties);
        } else {
          // Fallback data
          setProperties([
            {
              _id: "1",
              title: "Modern Apartment",
              price: 250000,
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              _id: "2",
              title: "Cozy Townhouse",
              price: 350000,
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              _id: "3",
              title: "Suburban Home",
              price: 450000,
              image: "/placeholder.svg?height=100&width=100",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching recommended properties:", error);
        // Use fallback data on error
        setProperties([
          {
            _id: "1",
            title: "Modern Apartment",
            price: 250000,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            _id: "2",
            title: "Cozy Townhouse",
            price: 350000,
            image: "/placeholder.svg?height=100&width=100",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProperties();
  }, []);

  const handlePropertyClick = (id: string) => {
    router.push(`/property/${id}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md ">
      <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
        Recommended Properties
      </h2>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="bg-gray-200 h-12 w-12 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {properties.map((property) => (
            <li 
              key={property._id} 
              className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => handlePropertyClick(property._id)}
            >
              <Image
                src={property.image || property.images?.[0] || "/placeholder.svg"}
                alt={property.title}
                width={50}
                height={50}
                className="rounded"
              />
              <div>
                <p className="font-medium">{property.title}</p>
                <p className="text-sm text-[#E74C3C]">
                  ${property.price.toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
