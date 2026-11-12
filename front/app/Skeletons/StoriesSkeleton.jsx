import SkeletonBlock from './SkeletonBlock';

const StoriesSkeleton = () => (
  <div aria-hidden="true" className="flex shrink-0 snap-start flex-col items-center gap-3">
    <div className="rounded-[1.8rem] bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/30 p-[3px] md:rounded-[2.2rem]">
      <SkeletonBlock className="h-16 w-16 rounded-[1.6rem] border border-white/10 md:h-20 md:w-20 md:rounded-[2rem]" />
    </div>
    <SkeletonBlock className="h-2.5 w-14 rounded-full" />
  </div>
);

export default StoriesSkeleton;
