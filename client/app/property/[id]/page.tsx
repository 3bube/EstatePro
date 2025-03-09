"use client";
import { use, useState } from "react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PropertyDetails } from "@/components/PropertyDetails";
import { PropertyDescription } from "@/components/PropertyDescription";
import { FeaturesAmenities } from "@/components/FeaturesAmenities";
import { FloorPlan } from "@/components/FloorPlan";
import PropertyMap from "@/components/PropertyMap";
import { NearbyPlaces } from "@/components/NearbyPlaces";
import { AgentContact } from "@/components/AgentContract";
import { SimilarProperties } from "@/components/SimilarProperties";
import { PropertyReviews } from "@/components/PropertyReviews";
import { useQuery } from "@tanstack/react-query";
import { getPropertyById } from "@/api/property.api";
import { MessageModal } from "@/components/MessageModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useToast } from "@/hooks/use-toast";

export default function PropertyPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const router = useRouter();

  const handleMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: "You need to be logged in",
        description: "Please login to continue",
      });
      return router.push("/auth");
    }
    setIsMessageModalOpen(true);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
  });

  const property = data?.data;

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PhotoGallery property={property} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyDetails property={property} />
          <PropertyDescription description={property?.description} />
          <FeaturesAmenities
            features={property?.features}
            amenities={property?.amenities}
          />
          <FloorPlan property={property} />
          <PropertyMap
            latitude={property?.address?.coordinates?.latitude}
            longitude={property?.address?.coordinates?.longitude}
          />
          <NearbyPlaces />
          <PropertyReviews propertyId={property?.id} />
        </div>
        <div>
          <AgentContact owner={property?.owner} />
          <div className="mt-4 space-y-4">
            <button className="w-full bg-[#2C3E50] text-white py-2 px-4 rounded hover:bg-[#34495E]">
              Schedule Visit
            </button>
            <button
              className="w-full bg-white text-[#2C3E50] border border-[#2C3E50] py-2 px-4 rounded hover:bg-gray-50"
              onClick={() => handleMessage()}
            >
              Message Agent
            </button>
          </div>
        </div>
      </div>
      <SimilarProperties />
      <MessageModal
        agentId={property?.owner?._id}
        propertyId={property?._id}
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
      />
    </div>
  );
}
