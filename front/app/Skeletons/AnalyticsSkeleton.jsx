import SkeletonBlock from './SkeletonBlock';

const AnalyticsSkeleton = () => (
  <div
    role="status"
    aria-label="Loading analytics"
    aria-busy="true"
    className="min-h-screen w-full space-y-10 bg-[#030712] p-4 text-white sm:p-6 lg:p-10"
  >
    <header className="flex flex-col items-start justify-between gap-6 pt-2 lg:flex-row lg:items-center">
      <div className="flex items-center gap-5">
        <SkeletonBlock tone="dark" className="h-16 w-16 shrink-0 rounded-2xl sm:h-20 sm:w-20" />
        <div className="space-y-3">
          <SkeletonBlock tone="dark" className="h-8 w-48 max-w-full rounded-xl sm:h-10" />
          <SkeletonBlock tone="dark" className="h-3 w-64 max-w-full rounded-full" />
        </div>
      </div>
      <div className="flex w-full gap-3 lg:w-auto">
        <SkeletonBlock tone="dark" className="h-12 flex-1 rounded-2xl lg:w-48 lg:flex-none" />
        <SkeletonBlock tone="dark" className="h-12 flex-1 rounded-2xl lg:w-40 lg:flex-none" />
      </div>
    </header>

    <section aria-hidden="true" className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:rounded-[2rem] sm:p-6"
        >
          <SkeletonBlock tone="dark" className="mb-5 h-10 w-10 rounded-xl" />
          <SkeletonBlock tone="dark" className="mb-2 h-7 w-24 max-w-full rounded-lg" />
          <SkeletonBlock tone="dark" className="h-3 w-20 max-w-full rounded-full" />
        </div>
      ))}
    </section>

    <section aria-hidden="true" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {[{ span: 8, columns: 12 }, { span: 4, columns: 7 }].map(({ span, columns }) => (
        <div
          key={span}
          className={`rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-7 ${span === 8 ? 'lg:col-span-8' : 'lg:col-span-4'}`}
        >
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <SkeletonBlock tone="dark" className="h-5 w-36 max-w-full rounded-lg" />
              <SkeletonBlock tone="dark" className="h-3 w-24 max-w-full rounded-full" />
            </div>
            <SkeletonBlock tone="dark" className="h-8 w-20 rounded-lg" />
          </div>
          <div className="flex h-56 items-end gap-3 sm:h-72">
            {Array.from({ length: columns }, (_, index) => (
              <SkeletonBlock
                key={index}
                tone="dark"
                className="min-w-0 flex-1 rounded-t-lg"
                style={{ height: `${35 + ((index * 17) % 55)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  </div>
);

export default AnalyticsSkeleton;
