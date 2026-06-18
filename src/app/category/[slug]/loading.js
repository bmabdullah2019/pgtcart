export default function CategoryLoading() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Breadcrumb */}
      <div className="h-4 w-48 bg-gray-200 rounded"></div>

      {/* Page Title */}
      <div className="h-7 w-64 bg-gray-200 rounded"></div>

      {/* Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters Skeleton */}
        <div className="bg-white border border-gray-100 rounded-lg p-4 space-y-4 hidden lg:block">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-100 rounded w-full"></div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <div className="h-5 w-16 bg-gray-200 rounded mb-3"></div>
            <div className="h-2 bg-gray-100 rounded w-full mb-2"></div>
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-gray-100 rounded"></div>
              <div className="h-3 w-12 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="pt-[100%] bg-gray-100 relative"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
