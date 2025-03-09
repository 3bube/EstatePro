import { PropertyCard } from "./PropertyCard";

export function SimilarProperties() {
  const similarProperties = [
    {
      id: 1,
      title: "Modern Apartment",
      price: 500000,
      beds: 2,
      baths: 2,
      sqft: 1200,
    },
    {
      id: 2,
      title: "Cozy Townhouse",
      price: 450000,
      beds: 3,
      baths: 2.5,
      sqft: 1800,
    },
    {
      id: 3,
      title: "Suburban Home",
      price: 650000,
      beds: 4,
      baths: 3,
      sqft: 2200,
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">
        Similar Properties
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
