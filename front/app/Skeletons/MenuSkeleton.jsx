import SkeletonBlock from './SkeletonBlock';

const MenuSkeleton = () => (
  <div aria-hidden="true" className="space-y-2 p-4">
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/5 dark:bg-white/[0.02]"
      >
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-3/4 max-w-full rounded-full" />
          <SkeletonBlock className="h-2.5 w-1/2 max-w-full rounded-full" />
        </div>
        <SkeletonBlock className="h-7 w-7 shrink-0 rounded-full" />
      </div>
    ))}
  </div>
);

export default MenuSkeleton;
