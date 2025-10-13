const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Image */}
      <div className="aspect-square bg-gray-200"></div>

      {/* Content */}
      <div className="p-4">
        {/* Company */}
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>

        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;