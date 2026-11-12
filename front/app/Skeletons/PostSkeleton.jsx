import SkeletonBlock from './SkeletonBlock';

const PostSkeleton = ({ className = '' }) => (
  <article
    aria-hidden="true"
    className={`mb-6 w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-6 ${className}`}
  >
    <header className="mb-5 flex items-center gap-3">
      <SkeletonBlock className="h-11 w-11 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-32 max-w-full rounded-full" />
        <SkeletonBlock className="h-3 w-20 rounded-full" />
      </div>
      <SkeletonBlock className="h-8 w-8 rounded-full" />
    </header>

    <div className="mb-5 space-y-2">
      <SkeletonBlock className="h-3 w-full rounded-full" />
      <SkeletonBlock className="h-3 w-5/6 max-w-full rounded-full" />
      <SkeletonBlock className="h-3 w-2/3 max-w-full rounded-full" />
    </div>

    <SkeletonBlock className="mb-5 aspect-[4/3] w-full rounded-2xl sm:aspect-[16/9]" />

    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/5">
      <SkeletonBlock className="h-3 w-20 rounded-full" />
      <SkeletonBlock className="h-3 w-16 rounded-full" />
    </div>
    <div className="flex items-center justify-between gap-4">
      {[0, 1, 2].map((item) => (
        <SkeletonBlock key={item} className="h-8 w-16 max-w-[28%] rounded-lg" />
      ))}
    </div>
  </article>
);

export default PostSkeleton;
