import SkeletonBlock from './SkeletonBlock';

const CommentSkeleton = () => (
  <div
    aria-hidden="true"
    className="mb-4 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
  >
    <div className="flex items-start gap-3">
      <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-4 w-28 max-w-[55%] rounded-full" />
          <SkeletonBlock className="h-3 w-12 rounded-full" />
        </div>
        <SkeletonBlock className="h-3 w-full rounded-full" />
        <SkeletonBlock className="h-3 w-3/4 max-w-full rounded-full" />
        <div className="flex gap-4 pt-1">
          <SkeletonBlock className="h-3 w-12 rounded-full" />
          <SkeletonBlock className="h-3 w-14 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default CommentSkeleton;
