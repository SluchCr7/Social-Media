import SkeletonBlock from './SkeletonBlock';

const ProfileSkeleton = () => (
  <div
    role="status"
    aria-label="Loading profile"
    aria-busy="true"
    className="min-h-screen w-full bg-lightMode-bg px-3 py-6 text-lightMode-text dark:bg-darkMode-bg dark:text-darkMode-text sm:px-6 lg:px-8"
  >
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <SkeletonBlock className="h-48 w-full sm:h-64" />
        <div className="px-4 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
            <SkeletonBlock className="h-24 w-24 shrink-0 rounded-3xl border-4 border-white dark:border-[#0b0b0d] sm:h-32 sm:w-32" />
            <div className="min-w-0 flex-1 space-y-3 pb-2">
              <SkeletonBlock className="h-8 w-64 max-w-full rounded-xl" />
              <div className="flex flex-wrap gap-3">
                <SkeletonBlock className="h-3 w-24 rounded-full" />
                <SkeletonBlock className="h-3 w-20 rounded-full" />
                <SkeletonBlock className="h-3 w-28 rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="h-10 w-32 rounded-xl sm:mb-2" />
          </div>

          <div className="mt-6 max-w-3xl space-y-2">
            <SkeletonBlock className="h-3 w-full rounded-full" />
            <SkeletonBlock className="h-3 w-2/3 max-w-full rounded-full" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
        <div className="flex items-center gap-4 overflow-hidden">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex shrink-0 flex-col items-center gap-2">
              <SkeletonBlock className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />
              <SkeletonBlock className="h-2.5 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <SkeletonBlock className="mb-4 h-4 w-36 rounded-full" />
        <SkeletonBlock className="mb-2 h-3 w-full max-w-3xl rounded-full" />
        <SkeletonBlock className="h-3 w-2/3 max-w-2xl rounded-full" />
      </section>

      <div className="flex gap-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 dark:border-white/10 dark:bg-white/[0.03]">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} className="h-10 w-24 shrink-0 rounded-xl" />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SkeletonBlock className="h-10 w-full rounded-xl sm:w-72" />
        <SkeletonBlock className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[0, 1].map((index) => (
          <div key={index} className="rounded-3xl border border-slate-200/80 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <SkeletonBlock className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-3 w-32 rounded-full" />
                <SkeletonBlock className="h-2.5 w-20 rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="mb-4 aspect-[4/3] w-full rounded-2xl" />
            <SkeletonBlock className="h-3 w-2/3 max-w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
