"use client";

import { useState } from "react";
import { OverallRating } from "@/components/OverallRating";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { ReviewFilters } from "@/components/ReviewFilters";
import { ReviewCard } from "@/components/ReviewCard";
import { WriteReviewForm } from "@/components/WriteReviewForm";
import { Button } from "@/components/ui/button";

export default function PropertyReviewsPage({
  params,
}: {
  params: { id: string };
}) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [filterOption, setFilterOption] = useState("newest");

  // In a real application, you would fetch this data based on the property ID
  const propertyData = {
    id: params.id,
    name: "Luxury Downtown Apartment",
    overallRating: 4.5,
    totalReviews: 28,
    ratingBreakdown: {
      location: 4.8,
      value: 4.2,
      condition: 4.5,
      amenities: 4.7,
    },
  };

  const reviews = [
    {
      id: "1",
      userName: "John Doe",
      userAvatar: "/placeholder.svg?height=50&width=50",
      date: "2023-05-15",
      rating: 5,
      review:
        "Absolutely loved this property! The location is perfect and the amenities are top-notch.",
      helpfulCount: 12,
      realtorResponse:
        "Thank you for your wonderful review, John! We're thrilled to hear you enjoyed your stay.",
    },
    {
      id: "2",
      userName: "Jane Smith",
      userAvatar: "/placeholder.svg?height=50&width=50",
      date: "2023-05-10",
      rating: 4,
      review:
        "Great property overall. The only downside was the noise from the street, but everything else was excellent.",
      helpfulCount: 8,
      realtorResponse: "",
    },
    // Add more review objects as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2C3E50] mb-6">
        {propertyData.name} - Reviews
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <OverallRating
            rating={propertyData.overallRating}
            totalReviews={propertyData.totalReviews}
          />
          <RatingBreakdown breakdown={propertyData.ratingBreakdown} />
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <ReviewFilters onFilterChange={setFilterOption} />
            <Button
              onClick={() => setShowWriteReview(true)}
              className="bg-[#2C3E50] text-white hover:bg-[#34495E]"
            >
              Write a Review
            </Button>
          </div>
          {showWriteReview && (
            <WriteReviewForm
              propertyId={params.id}
              onClose={() => setShowWriteReview(false)}
            />
          )}
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
