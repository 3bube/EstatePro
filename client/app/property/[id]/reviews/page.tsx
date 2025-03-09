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
  const [activeFilter, setActiveFilter] = useState("newest");

  // In a real application, you would fetch this data based on the property ID
  const propertyData = {
    id: params.id,
    title: "Luxury Condo in Downtown",
    reviews: [
      {
        id: "1",
        user: "John Doe",
        date: "2023-05-15",
        rating: 4.5,
        comment:
          "Beautiful property with great amenities. The location is perfect for city living.",
        helpful: 12,
      },
      {
        id: "2",
        user: "Jane Smith",
        date: "2023-04-20",
        rating: 5,
        comment:
          "Absolutely loved my stay here. The views are incredible and the property is well-maintained.",
        helpful: 8,
      },
      {
        id: "3",
        user: "Mike Johnson",
        date: "2023-03-10",
        rating: 3.5,
        comment:
          "Good property but a bit overpriced for what you get. Noise from the street can be an issue.",
        helpful: 5,
      },
    ],
    averageRating: 4.3,
    totalReviews: 3,
    ratingBreakdown: {
      5: 1,
      4: 1,
      3: 1,
      2: 0,
      1: 0,
    },
  };

  // Filter reviews based on activeFilter
  const filteredReviews = [...propertyData.reviews].sort((a, b) => {
    if (activeFilter === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (activeFilter === "highest") {
      return b.rating - a.rating;
    } else if (activeFilter === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#2C3E50] mb-6">
        {propertyData.title} - Reviews
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <OverallRating
            rating={propertyData.averageRating}
            totalReviews={propertyData.totalReviews}
          />
          <RatingBreakdown breakdown={propertyData.ratingBreakdown} />
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <ReviewFilters onFilterChange={setActiveFilter} />
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
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={{
                  id: review.id,
                  userName: review.user,
                  userAvatar: "/placeholder.svg?height=50&width=50",
                  date: review.date,
                  rating: review.rating,
                  review: review.comment,
                  helpfulCount: review.helpful,
                  realtorResponse: "",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
