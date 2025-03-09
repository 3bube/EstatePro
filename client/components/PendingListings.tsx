import { ListingCard } from "./ListingCard";

export function PendingListings({
  pendingListings,
}: {
  pendingListings: any[];
}) {
  if (!pendingListings.length) {
    return (
      <div className="text-center text-gray-500">
        No pending listings available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pendingListings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} status="pending" />
      ))}
    </div>
  );
}
