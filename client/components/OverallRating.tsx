import { Star, StarHalf } from "lucide-react";

type OverallRatingProps = {
  rating: number;
  totalReviews: number;
};

export function OverallRating({ rating, totalReviews }: OverallRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Overall Rating</h2>
      <div className="flex items-center mb-2">
        <span className="text-4xl font-bold text-[#E74C3C] mr-2">
          {rating.toFixed(1)}
        </span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              {i < fullStars ? (
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
              ) : i === fullStars && hasHalfStar ? (
                <StarHalf className="w-6 h-6 text-yellow-400 fill-current" />
              ) : (
                <Star className="w-6 h-6 text-gray-300" />
              )}
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-600">Based on {totalReviews} reviews</p>
    </div>
  );
}
