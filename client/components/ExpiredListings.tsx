import { ListingCard } from "./ListingCard";

export function ExpiredListings({
  expiredListings,
}: {
  expiredListings: any[];
}) {
  if (!expiredListings.length) {
    return (
      <div className="text-center text-gray-500">
        No expired listings available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {expiredListings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} status="expired" />
      ))}
    </div>
  );
}
