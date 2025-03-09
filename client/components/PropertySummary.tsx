import Image from "next/image";

type PropertySummaryProps = {
  property: {
    image: string;
    address: string;
    price: number;
  };
};

export function PropertySummary({ property }: PropertySummaryProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
      <Image
        src={property.image || "/placeholder.svg"}
        alt="Property"
        width={100}
        height={100}
        className="rounded-md mr-4"
      />
      <div>
        <h2 className="text-lg font-semibold text-[#2C3E50]">
          {property.address}
        </h2>
        <p className="text-[#E74C3C] font-bold">
          ${property.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
