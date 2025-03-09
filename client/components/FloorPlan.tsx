import Image from "next/image";

export function FloorPlan({ property }: { property: any }) {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Floor Plan</h2>
      <div className="relative h-[400px]">
        <Image
          src={property?.images?.[0] || "/placeholder.svg?height=400&width=800"}
          alt="Floor plan"
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
    </div>
  );
}
