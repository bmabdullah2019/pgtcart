export default function Loading() {
  return (
    <div className="w-full animate-pulse space-y-8">
      {/* Hero Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar Skeleton */}
        <div className="bg-white border border-gray-100 rounded-lg p-4 hidden lg:block">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-100 rounded w-full"></div>
            ))}
          </div>
        </div>

        {/* Hero Slider Skeleton */}
        <div className="lg:col-span-3">
          <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Category Icons Strip Skeleton */}
      <div className="bg-white border border-gray-100 rounded-lg p-4">
        <div className="flex gap-4 justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-28">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-16 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Deals Section Skeleton */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-6 bg-yellow-300 rounded"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[220px] flex-shrink-0 bg-white border border-gray-100 rounded-lg overflow-hidden">
              <div className="pt-[100%] bg-gray-100 relative"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Product Sections Skeleton */}
      {[...Array(2)].map((_, secIdx) => (
        <section key={secIdx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="h-5 w-36 bg-gray-200 rounded"></div>
            <div className="flex gap-1">
              <div className="h-7 w-7 bg-gray-100 rounded"></div>
              <div className="h-7 w-7 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div className="h-[3px] bg-yellow-300 w-full"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border-b border-r border-gray-100 p-4">
                <div className="pt-[100%] bg-gray-100 relative mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
