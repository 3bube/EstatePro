import { PropertyCard } from "./PropertyCard";

type Property = {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  address: string;
};

type PropertyListProps = {
  properties: Property[];
};

export function PropertyList({ properties }: PropertyListProps) {
  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} layout="list" />
      ))}
    </div>
  );
}
