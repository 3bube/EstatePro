"use client";

import Image from "next/image";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/api/property.api";
import { SkeletonCard } from "@/components/ListingSkeleton";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading properties. Please try again later.
      </div>
    );
  }

  // filter the isFeatured properties
  const featuredProperties = data?.filter((p: any) => p.isFeatured);

  // filter the new listings
  const newListings = data?.filter((p: any) => !p.isFeatured);

  return (
    <main>
      <section className="relative h-[500px]">
        <Image
          src="https://images.pexels.com/photos/16046418/pexels-photo-16046418.jpeg"
          alt="Real estate hero image"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Home</h1>
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-72">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredProperties?.length > 0 ? (
            featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <div className="text-gray-500">
              No featured properties available
            </div>
          )}
        </div>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">New Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-72">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : newListings?.length > 0 ? (
            newListings.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <div className="text-gray-500">No new listings available</div>
          )}
        </div>
      </section>

      {/* categories */}
      {/* <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/category/buy"
            className="bg-[#2C3E50] text-white p-4 rounded text-center hover:bg-[#E74C3C]"
          >
            Buy
          </a>
          <a
            href="/category/rent"
            className="bg-[#2C3E50] text-white p-4 rounded text-center hover:bg-[#E74C3C]"
          >
            Rent
          </a>
          <a
            href="/category/commercial"
            className="bg-[#2C3E50] text-white p-4 rounded text-center hover:bg-[#E74C3C]"
          >
            Commercial
          </a>
          <a
            href="/category/new-developments"
            className="bg-[#2C3E50] text-white p-4 rounded text-center hover:bg-[#E74C3C]"
          >
            New Developments
          </a>
        </div>
      </section> */}
    </main>
  );
}
