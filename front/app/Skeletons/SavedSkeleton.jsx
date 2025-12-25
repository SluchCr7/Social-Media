import React from 'react';
import { motion } from 'framer-motion';

// Base Skeleton Component
const Skeleton = ({ type = 'text', className = '' }) => {
    const baseClasses = 'relative overflow-hidden';

    return (
        <div className={`${baseClasses} ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-gray-200/50 dark:from-gray-700/50 dark:to-gray-600/50 animate-pulse" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
    );
};

// Music Item Skeleton
const MusicItemSkeleton = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative flex items-center gap-4 p-5 rounded-2xl overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/30" />
        <div className="relative flex items-center gap-4 w-full">
            <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-4/5 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>
            <Skeleton className="hidden sm:block w-10 h-3 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        </div>
    </motion.div>
);

// Post Item Skeleton
const PostItemSkeleton = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30" />
        <div className="relative space-y-5">
            {/* User Info */}
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-3 w-20 rounded-full" />
                </div>
            </div>

            {/* Text */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-11/12 rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
            </div>

            {/* Image */}
            <Skeleton className="w-full h-64 rounded-2xl" />

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
            </div>
        </div>
    </motion.div>
);

// Reel Item Skeleton
const ReelItemSkeleton = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden h-60"
    >
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
            <Skeleton className="h-4 w-3/4 rounded-full bg-white/20" />
        </div>
    </motion.div>
);

// Main Component
export default function SavedPageSkeleton({ activeTab = 'posts' }) {
    let contentSkeleton = null;

    switch (activeTab) {
        case 'music':
            contentSkeleton = (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <MusicItemSkeleton key={i} />)}
                </div>
            );
            break;
        case 'reels':
            contentSkeleton = (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <ReelItemSkeleton key={i} />)}
                </div>
            );
            break;
        case 'posts':
        default:
            contentSkeleton = (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => <PostItemSkeleton key={i} />)}
                </div>
            );
            break;
    }

    return (
        <div className="min-h-screen w-full py-12 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl w-full mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
                        <div>
                            <Skeleton className="h-8 w-72 rounded-xl mb-2" />
                            <Skeleton className="hidden sm:block h-4 w-96 rounded-full" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto">
                        <Skeleton className="w-full md:w-64 h-11 rounded-2xl" />
                        <div className="hidden md:flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-1 border border-white/20 dark:border-gray-700/30">
                            <Skeleton className="h-8 w-20 rounded-xl" />
                            <Skeleton className="h-8 w-20 rounded-xl" />
                            <Skeleton className="h-8 w-20 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Mobile Tabs */}
                <div className="flex md:hidden gap-3 mb-8">
                    <Skeleton className="flex-1 h-10 rounded-xl" />
                    <Skeleton className="flex-1 h-10 rounded-xl" />
                    <Skeleton className="flex-1 h-10 rounded-xl" />
                </div>

                {/* Content */}
                <div>{contentSkeleton}</div>
            </div>

            <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </div>
    );
}