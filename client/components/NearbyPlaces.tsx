export function NearbyPlaces() {
  const places = [
    { type: "School", name: "Anytown Elementary", distance: "0.5 miles" },
    { type: "Shopping", name: "Main Street Mall", distance: "1.2 miles" },
    { type: "Park", name: "Central Park", distance: "0.8 miles" },
  ];

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Nearby Places</h2>
      <div className="space-y-4">
        {places.map((place, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{place.name}</p>
              <p className="text-gray-600">{place.type}</p>
            </div>
            <p className="text-gray-600">{place.distance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
