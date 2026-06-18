export default function ProductLoading() {
  return (
    <div className="w-full animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-64 bg-gray-200 rounded mb-6"></div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-3">
          <div className="w-full aspect-square bg-gray-200 rounded-lg"></div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-100 rounded"></div>
          </div>

          {/* Variants */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>

          {/* Quantity + Cart */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-full bg-gray-100 rounded"></div>
            <div className="h-3 w-full bg-gray-100 rounded"></div>
            <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-12 space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[220px] flex-shrink-0 bg-white border border-gray-100 rounded-lg overflow-hidden">
              <div className="pt-[100%] bg-gray-100 relative"></div>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
