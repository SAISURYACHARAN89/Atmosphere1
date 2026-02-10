const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-700 rounded ${className}`} />
);

const StartupPostSkeleton = () => {
  return (
    <div className="p-4 mb-2 bg-black animate-pulse space-y-3">
      {/* Header */}
      <div className="flex items-center">
        <Skeleton className="w-10 h-10 rounded-full" />

        <div className="ml-3 space-y-2">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-20 h-3" />
        </div>

        <Skeleton className="ml-auto w-6 h-6 rounded-full" />
      </div>

      {/* Media */}
      <Skeleton className="w-full h-[250px] " />

      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="w-4/5 h-4" />
        <Skeleton className="w-3/5 h-3" />
      </div>

      {/* Stats */}
      <div className="flex justify-between px-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-10 h-5" />
        ))}
      </div>
    </div>
  );
};

export default StartupPostSkeleton;
