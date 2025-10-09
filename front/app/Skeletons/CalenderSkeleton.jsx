const CalendarSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="h-6 w-24 bg-gray-700/40 rounded-lg" />
      <div className="h-6 w-32 bg-gray-700/40 rounded-lg" />
      <div className="h-6 w-24 bg-gray-700/40 rounded-lg" />
    </div>

    {/* Days header */}
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-5 bg-gray-700/30 rounded" />
      ))}
    </div>

    {/* Days */}
    <div className="grid grid-cols-7 gap-2 mt-3">
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="h-20 sm:h-24 bg-gray-800/40 rounded-xl border border-gray-700/40"
        />
      ))}
    </div>
  </div>
);

export default CalendarSkeleton;
