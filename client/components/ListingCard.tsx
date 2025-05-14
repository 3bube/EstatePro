import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListingAnalytics } from "./ListingAnalytics";
import { LocateIcon as MdLocationOn } from "lucide-react";
import { Badge } from "./ui/badge";

type ListingCardProps = {
  listing: {
    id: string;
    title: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    views: number;
    inquiries: number;
    daysListed: number;
  };
  status: "active" | "pending" | "expired";
};

export function ListingCard({ listing, status }: ListingCardProps) {
  const formatAddress = (address: ListingCardProps["listing"]["address"]) => {
    if (!address) return "Address not available";
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MdLocationOn className="text-gray-500" />
          {formatAddress(listing.address)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <span className="text-2xl font-bold text-[#E74C3C]">
            ${listing?.price?.toLocaleString()}
          </span>
          <Badge variant={status === "active" ? "success" : "destructive"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div>
            <span className="font-semibold">{listing.bedrooms}</span> beds
          </div>
          <div>
            <span className="font-semibold">{listing.bathrooms}</span> baths
          </div>
          <div>
            <span className="font-semibold">
              {listing?.sqft?.toLocaleString()}
            </span>{" "}
            sqft
          </div>
        </div>
        <ListingAnalytics listing={listing} />
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Delete</Button>
      </CardFooter> */}
    </Card>
  );
}
