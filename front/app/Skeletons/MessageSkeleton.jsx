import React from 'react';

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          {idx % 2 === 0 && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <div className="relative h-4 w-16 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            <div className="relative h-12 w-[200px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>

          {idx % 2 !== 0 && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MessageSkeleton;