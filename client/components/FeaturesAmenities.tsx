export function FeaturesAmenities({ features, amenities }) {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">
        Features & Amenities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Features</h3>
          <ul className="list-disc list-inside text-gray-700">
            {features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Amenities</h3>
          <ul className="list-disc list-inside text-gray-700">
            {amenities?.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
