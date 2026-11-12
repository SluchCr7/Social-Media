import SkeletonBlock from './SkeletonBlock';

const MessageSkeleton = () => (
  <div aria-hidden="true" className="flex-1 space-y-4 overflow-y-auto p-4">
    {Array.from({ length: 6 }, (_, index) => {
      const isIncoming = index % 2 === 0;

      return (
        <div
          key={index}
          className={`flex items-end gap-2 sm:gap-3 ${isIncoming ? 'justify-start' : 'justify-end'}`}
        >
          {isIncoming && <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10" />}
          <div className={`flex max-w-[78%] flex-col gap-2 ${isIncoming ? 'items-start' : 'items-end'}`}>
            <SkeletonBlock className="h-3 w-16 rounded-full" />
            <SkeletonBlock
              className={`h-12 w-[min(70vw,20rem)] max-w-full rounded-2xl ${isIncoming ? 'rounded-bl-md' : 'rounded-br-md'}`}
            />
          </div>
          {!isIncoming && <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10" />}
        </div>
      );
    })}
  </div>
);

export default MessageSkeleton;
