import SkeletonBlock from './SkeletonBlock';

const SidebarSkeleton = () => (
  <div aria-hidden="true" className="w-full space-y-3 p-5">
    <SkeletonBlock className="mb-7 h-10 w-32 rounded-xl" />
    {Array.from({ length: 7 }, (_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5"
      >
        <SkeletonBlock className="h-6 w-6 shrink-0 rounded-lg" />
        <SkeletonBlock className="h-3 w-32 max-w-[70%] rounded-full" />
      </div>
    ))}
    <div className="mt-8 border-t border-slate-200 pt-4 dark:border-white/10">
      <div className="flex items-center gap-3 px-3">
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-28 max-w-full rounded-full" />
          <SkeletonBlock className="h-2.5 w-20 max-w-full rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default SidebarSkeleton;
