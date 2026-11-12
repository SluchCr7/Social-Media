import SkeletonBlock from './SkeletonBlock';

const CalendarSkeleton = () => (
  <div
    role="status"
    aria-label="Loading calendar"
    aria-busy="true"
    className="min-h-screen w-full overflow-hidden bg-slate-50 p-3 text-gray-900 dark:bg-black dark:text-white sm:p-6 lg:p-8"
  >
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-9 w-1.5 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-40 max-w-full rounded-xl" />
            <SkeletonBlock className="h-3 w-56 max-w-full rounded-full" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SkeletonBlock className="h-10 w-full rounded-xl sm:w-56" />
          <SkeletonBlock className="h-10 w-20 rounded-xl" />
          <SkeletonBlock className="h-10 w-32 rounded-xl" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <section
          aria-hidden="true"
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03] lg:col-span-3"
        >
          <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50/50 dark:border-white/10 dark:bg-white/[0.02]">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="flex justify-center py-3">
                <SkeletonBlock className="h-3 w-8 rounded-full" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200/70 dark:bg-white/10">
            {Array.from({ length: 42 }, (_, index) => (
              <div
                key={index}
                className="min-h-[72px] bg-white p-2 dark:bg-[#0B0F1A] sm:min-h-[110px]"
              >
                <SkeletonBlock className="mb-3 h-6 w-6 rounded-full" />
                <div className="hidden space-y-1 sm:block">
                  <SkeletonBlock className="h-5 w-full rounded-md" />
                  {index % 3 === 0 && <SkeletonBlock className="h-5 w-4/5 rounded-md" />}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside aria-hidden="true" className="space-y-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <SkeletonBlock className="mb-4 h-3 w-24 rounded-full" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/[0.02]"
                >
                  <SkeletonBlock className="h-4 w-4 rounded" />
                  <SkeletonBlock className="h-6 w-10 rounded-md" />
                  <SkeletonBlock className="h-3 w-16 max-w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <SkeletonBlock className="h-3 w-28 rounded-full" />
            <div className="space-y-3">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <SkeletonBlock className="h-3 w-20 rounded-full" />
                  <SkeletonBlock className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          <SkeletonBlock className="h-11 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  </div>
);

export default CalendarSkeleton;
