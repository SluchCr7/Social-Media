import SkeletonBlock from './SkeletonBlock';

const ReelSkeleton = () => (
  <div
    role="status"
    aria-label="Loading reel"
    aria-busy="true"
    className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden bg-black"
  >
    <div className="relative h-full w-full overflow-hidden bg-zinc-950">
      <SkeletonBlock tone="dark" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      <div className="absolute bottom-8 left-5 right-16 space-y-3 sm:bottom-10 sm:left-7">
        <SkeletonBlock tone="dark" className="h-4 w-36 max-w-full rounded-full" />
        <SkeletonBlock tone="dark" className="h-3 w-full max-w-sm rounded-full" />
        <SkeletonBlock tone="dark" className="h-3 w-2/3 max-w-xs rounded-full" />
      </div>

      <div className="absolute bottom-10 right-5 flex flex-col items-center gap-5">
        <SkeletonBlock tone="dark" className="h-11 w-11 rounded-full" />
        <SkeletonBlock tone="dark" className="h-11 w-11 rounded-full" />
        <SkeletonBlock tone="dark" className="h-11 w-11 rounded-full" />
      </div>
    </div>
  </div>
);

export default ReelSkeleton;
