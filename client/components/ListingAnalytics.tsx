import { Eye, MessageCircle, Calendar } from "lucide-react";

type ListingAnalyticsProps = {
  listing: {
    views: number;
    inquiries: number;
    daysListed: number;
  };
};

export function ListingAnalytics({ listing }: ListingAnalyticsProps) {
  return (
    <div className="flex justify-between text-sm text-gray-500">
      <div className="flex items-center">
        <Eye className="w-4 h-4 mr-1" />
        {listing.views} views
      </div>
      <div className="flex items-center">
        <MessageCircle className="w-4 h-4 mr-1" />
        {listing.inquiries} inquiries
      </div>
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-1" />
        {listing.daysListed} days listed
      </div>
    </div>
  );
}
