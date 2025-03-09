export function ListingStats() {
  const stats = [
    { name: "Active Listings", value: 15 },
    { name: "Pending Sales", value: 5 },
    { name: "Closed Sales (This Month)", value: 8 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
        Listing Stats
      </h2>
      <ul className="space-y-4">
        {stats.map((stat) => (
          <li key={stat.name} className="flex justify-between items-center">
            <span>{stat.name}</span>
            <span className="font-bold text-[#E74C3C]">{stat.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
