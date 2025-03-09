"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Property = {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image?: string;
  images?: string[];
  address: string;
};

type PropertyCardProps = {
  property: Property;
  layout?: "grid" | "list";
};

export function PropertyCard({ property, layout = "grid" }: PropertyCardProps) {
  const router = useRouter();

  console.log("Property:", property);

  const handlePropertyDetails = (id: string) => {
    router.push(`/property/${id}`);
  };

  return (
    <Card className={`overflow-hidden ${layout === "list" ? "flex" : ""};`}>
      <div className={layout === "list" ? "w-1/3" : ""}>
        <Image
          src={property?.image ?? property?.images?.[0]}
          alt={property?.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          priority
        />
      </div>
      <div className={layout === "list" ? "w-2/3" : ""}>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{property?.title}</h3>
          <p className="text-sm text-gray-500">{property?.address?.city}</p>
          <p className="text-xl font-bold mt-2">
            ${property?.price?.toLocaleString()}
          </p>
          <div className="flex justify-between mt-2 text-sm">
            <span>{property?.bedrooms} beds</span>
            <span>{property?.bathrooms} baths</span>
            <span>{property?.area?.toLocaleString()} sqft</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => handlePropertyDetails(property._id)}
          >
            View Details
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
