import SkeletonBlock from './SkeletonBlock';

const ExploreSkeleton = () => (
  <div aria-hidden="true" className="w-full space-y-8">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-40 rounded-full" />
        <SkeletonBlock className="h-9 w-48 rounded-xl sm:h-10" />
        <SkeletonBlock className="h-4 w-64 max-w-full rounded-full" />
      </div>
      <SkeletonBlock className="h-11 w-36 rounded-xl" />
    </header>

    <SkeletonBlock className="h-12 w-full rounded-xl" />

    <div className="flex gap-2 overflow-hidden pb-1">
      {Array.from({ length: 5 }, (_, index) => (
        <SkeletonBlock key={index} className="h-10 w-24 shrink-0 rounded-full" />
      ))}
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <SkeletonBlock className="aspect-square w-full rounded-xl" />
          <div className="space-y-2 px-1 pb-1 pt-3">
            <SkeletonBlock className="h-3 w-3/4 max-w-full rounded-full" />
            <SkeletonBlock className="h-3 w-1/2 max-w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ExploreSkeleton;
