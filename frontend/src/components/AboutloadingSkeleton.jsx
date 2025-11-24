const Skeleton = ({ className = '' }) => (
  <div
    role="status"
    className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md ${className}`}
  />
);

export const AboutLoading = ({}) => {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#fafafa] px-4 py-16 transition-colors duration-300">
      <header className="w-full py-5 px-4 flex justify-between items-center">
        <Skeleton className="h-8 w-36 rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero skeleton */}
        <div className="text-center space-y-6">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-10 w-72 mx-auto" />
          <Skeleton className="h-5 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>

        {/* Mission skeleton */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>

        {/* Features skeleton */}
        <div>
          <Skeleton className="h-8 w-64 mx-auto" />
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>

        {/* Values skeleton */}
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-full" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
