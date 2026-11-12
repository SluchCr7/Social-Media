import SkeletonBlock from './SkeletonBlock';

const MusicSkeleton = () => (
  <div aria-hidden="true" className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
    <div className="min-w-0 space-y-6">
      <section className="rounded-[1.75rem] border border-white/[0.08] bg-[#111117] p-5 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <SkeletonBlock tone="dark" className="aspect-square w-full shrink-0 rounded-2xl sm:w-48" />
          <div className="min-w-0 flex-1 space-y-4">
            <SkeletonBlock tone="dark" className="h-5 w-32 rounded-full" />
            <SkeletonBlock tone="dark" className="h-8 w-3/4 max-w-full rounded-xl" />
            <SkeletonBlock tone="dark" className="h-4 w-1/2 max-w-full rounded-full" />
            <SkeletonBlock tone="dark" className="h-2 w-full rounded-full" />
            <div className="flex items-center gap-3 pt-2">
              <SkeletonBlock tone="dark" className="h-10 w-10 rounded-full" />
              <SkeletonBlock tone="dark" className="h-12 w-12 rounded-full" />
              <SkeletonBlock tone="dark" className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[1.75rem] border border-white/[0.08] bg-[#111117] p-4 sm:p-6">
        <div className="space-y-2 border-b border-white/[0.06] pb-4">
          <SkeletonBlock tone="dark" className="h-3 w-28 rounded-full" />
          <SkeletonBlock tone="dark" className="h-6 w-40 rounded-lg" />
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-xl p-2 sm:gap-4">
            <SkeletonBlock tone="dark" className="h-12 w-12 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock tone="dark" className="h-4 w-40 max-w-full rounded-full" />
              <SkeletonBlock tone="dark" className="h-3 w-28 max-w-full rounded-full" />
            </div>
            <SkeletonBlock tone="dark" className="h-9 w-9 shrink-0 rounded-full" />
          </div>
        ))}
      </section>
    </div>

    <aside className="space-y-4">
      <section className="space-y-4 rounded-[1.75rem] border border-white/[0.08] bg-[#111117] p-5">
        <SkeletonBlock tone="dark" className="h-4 w-32 rounded-full" />
        <SkeletonBlock tone="dark" className="aspect-square w-full rounded-2xl" />
        <SkeletonBlock tone="dark" className="h-4 w-3/4 max-w-full rounded-full" />
        <SkeletonBlock tone="dark" className="h-3 w-1/2 max-w-full rounded-full" />
      </section>
      <section className="space-y-4 rounded-[1.75rem] border border-white/[0.08] bg-[#111117] p-5">
        <SkeletonBlock tone="dark" className="h-4 w-28 rounded-full" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <SkeletonBlock tone="dark" className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock tone="dark" className="h-3 w-3/4 max-w-full rounded-full" />
              <SkeletonBlock tone="dark" className="h-2.5 w-1/2 max-w-full rounded-full" />
            </div>
          </div>
        ))}
      </section>
    </aside>
  </div>
);

export default MusicSkeleton;
