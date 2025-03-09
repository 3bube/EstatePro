import { ListingCard } from "./ListingCard";

export function ActiveListings({ activeListings }: { activeListings: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeListings?.map((listing) => (
        <ListingCard key={listing._id} listing={listing} status="active" />
      ))}
    </div>
  );
}
