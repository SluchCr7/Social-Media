import SkeletonBlock from './SkeletonBlock';

const SavedSkeleton = ({ activeTab = 'posts' }) => {
  const isPosts = activeTab === 'posts';
  const isMusic = activeTab === 'music';

  return (
    <div
      role="status"
      aria-label="Loading saved items"
      aria-busy="true"
      className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-[#050505] dark:text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <header className="flex flex-col items-start justify-between gap-6 border-b border-gray-200 pb-7 dark:border-white/10 md:flex-row md:items-end">
          <div className="w-full space-y-3">
            <SkeletonBlock className="h-6 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-72 max-w-full rounded-xl sm:h-12" />
            <SkeletonBlock className="h-3 w-full max-w-md rounded-full" />
          </div>
          <SkeletonBlock className="h-12 w-full rounded-xl md:w-80" />
        </header>

        <div className="mt-5 flex gap-2 rounded-xl border border-gray-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.03]">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>

        <section aria-hidden="true" className="mt-8">
          {isPosts ? (
            <div className="space-y-6">
              {[0, 1].map((index) => (
                <div key={index} className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <SkeletonBlock className="h-11 w-11 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBlock className="h-3 w-32 rounded-full" />
                      <SkeletonBlock className="h-2.5 w-20 rounded-full" />
                    </div>
                  </div>
                  <SkeletonBlock className="mb-4 aspect-[4/3] w-full rounded-2xl sm:aspect-[16/7]" />
                  <SkeletonBlock className="h-3 w-3/4 max-w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : isMusic ? (
            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03] sm:p-4">
                  <SkeletonBlock className="h-12 w-12 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-3 w-40 max-w-full rounded-full" />
                    <SkeletonBlock className="h-2.5 w-28 max-w-full rounded-full" />
                  </div>
                  <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <SkeletonBlock key={index} className="aspect-[9/16] w-full rounded-2xl" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SavedSkeleton;
