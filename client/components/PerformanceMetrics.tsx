export function PerformanceMetrics() {
  const metrics = [
    { name: "Properties Sold", value: 23 },
    { name: "Average Days on Market", value: 45 },
    { name: "Client Satisfaction", value: "4.8/5" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
        Performance Metrics
      </h2>
      <ul className="space-y-4">
        {metrics.map((metric) => (
          <li key={metric.name} className="flex justify-between items-center">
            <span>{metric.name}</span>
            <span className="font-bold text-[#E74C3C]">{metric.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
