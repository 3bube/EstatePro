export function PropertyDescription({ description }) {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Description</h2>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
    </div>
  );
}
