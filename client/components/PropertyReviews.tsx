"use client";

import { useState } from "react";
import { Star as StarIcon } from "lucide-react";

export function PropertyReviews({ propertyId }) {
  const [reviews] = useState([
    {
      id: 1,
      author: "John Doe",
      rating: 4,
      comment: "Great property, loved the location!",
    },
    {
      id: 2,
      author: "Jane Smith",
      rating: 5,
      comment: "Excellent amenities and very spacious.",
    },
    {
      id: 3,
      author: "Mike Johnson",
      rating: 3,
      comment: "Good overall, but needs some updates.",
    },
  ]);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center mb-2">
              <p className="font-semibold mr-2">{review.author}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
