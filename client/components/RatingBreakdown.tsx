type RatingBreakdownProps = {
  breakdown: {
    location: number;
    value: number;
    condition: number;
    amenities: number;
  };
};

export function RatingBreakdown({ breakdown }: RatingBreakdownProps) {
  const categories = Object.entries(breakdown);

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#2C3E50] mb-4">
        Rating Breakdown
      </h2>
      <div className="space-y-3">
        {categories.map(([category, rating]) => (
          <div key={category}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {category}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {rating.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#E74C3C] h-2 rounded-full"
                style={{ width: `${(rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
