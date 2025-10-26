export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md border border-border animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-64 bg-muted" />
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-muted rounded w-3/4" />
        
        {/* Location */}
        <div className="h-4 bg-muted rounded w-1/2" />
        
        {/* Price */}
        <div className="h-8 bg-muted rounded w-1/3" />
        
        {/* Features */}
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-muted rounded w-full" />
      </div>
    </div>
  );
};
