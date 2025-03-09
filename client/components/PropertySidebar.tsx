import Image from "next/image";

type PropertySidebarProps = {
  property: {
    id: number;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
  };
};

export function PropertySidebar({ property }: PropertySidebarProps) {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
          Property Details
        </h2>
        <Image
          src={property?.images[0] ?? "/placeholder.svg"}
          alt={property?.title}
          width={300}
          height={200}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-medium text-[#2C3E50] mb-2">
          {property?.title}
        </h3>
        <p className="text-[#E74C3C] font-bold mb-2">
          ${property?.price.toLocaleString()}
        </p>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{property?.bedrooms} beds</span>
          <span>{property?.bathrooms} baths</span>
          <span>{property?.area?.toLocaleString()} sqft</span>
        </div>
        <div className="space-y-2">
          <button className="w-full bg-[#2C3E50] text-white py-2 px-4 rounded hover:bg-[#34495E]">
            Schedule Visit
          </button>
          <button className="w-full bg-white text-[#2C3E50] border border-[#2C3E50] py-2 px-4 rounded hover:bg-gray-50">
            Make Offer
          </button>
        </div>
      </div>
    </aside>
  );
}
