export function PropertyDetails({ property }) {
  console.log(property);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[#2C3E50] mb-4">
        {property?.title}
      </h1>
      <p className="text-2xl font-semibold text-[#E74C3C] mb-2">
        ${property?.price?.toLocaleString()}
      </p>
      <p className="text-gray-600 mb-4">{property?.address?.city}</p>
      <div className="flex flex-wrap gap-4 text-gray-700">
        <div>
          <span className="font-semibold">{property?.bedrooms}</span> beds
        </div>
        <div>
          <span className="font-semibold">{property?.bathrooms}</span> baths
        </div>
        <div>
          <span className="font-semibold">
            {property?.area?.toLocaleString()}
          </span>{" "}
          sq ft
        </div>
        <div>
          Built in <span className="font-semibold">{property?.yearBuilt}</span>
        </div>
      </div>
      {property?.virtualTourUrl && (
        <a
          href={property?.virtualTourUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-[#2C3E50] text-white py-2 px-4 rounded hover:bg-[#34495E]"
        >
          Take Virtual Tour
        </a>
      )}
    </div>
  );
}
