export const PropertyDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-10 w-40 bg-muted rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery Skeleton */}
          <div className="bg-card rounded-lg overflow-hidden shadow-md">
            <div className="w-full h-96 bg-muted" />
            <div className="flex gap-2 p-4 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-muted" />
              ))}
            </div>
          </div>

          {/* Property Info Skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-md space-y-6">
            {/* Title & Location */}
            <div className="space-y-3">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>

            {/* Price */}
            <div className="h-10 bg-muted rounded w-1/3" />

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-md space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>

          {/* Amenities Skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-md space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card Skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-md space-y-4">
            <div className="h-6 bg-muted rounded w-2/3" />
            <div className="space-y-3">
              <div className="h-12 bg-muted rounded w-full" />
              <div className="h-12 bg-muted rounded w-full" />
              <div className="h-12 bg-muted rounded w-full" />
            </div>
          </div>

          {/* EMI Calculator Skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-md space-y-4">
            <div className="h-6 bg-muted rounded w-2/3" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
