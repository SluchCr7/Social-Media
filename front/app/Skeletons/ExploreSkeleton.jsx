'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ExploreSkeleton = () => {
    return (
        <div className="w-full space-y-12 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
                <div className="space-y-6 w-full max-w-2xl">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-white/5 rounded-full" />
                    <div className="space-y-3">
                        <div className="h-20 w-3/4 bg-gray-200 dark:bg-white/5 rounded-3xl" />
                        <div className="h-20 w-1/2 bg-gray-200 dark:bg-white/5 rounded-3xl" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="w-32 h-24 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                    <div className="w-32 h-24 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="h-24 w-full bg-gray-200 dark:bg-white/5 rounded-[3rem]" />

            {/* Tabs Skeleton */}
            <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 w-28 bg-gray-200 dark:bg-white/5 rounded-full flex-shrink-0" />
                ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-white/5 rounded-[2.5rem]" />
                ))}
            </div>
        </div>
    );
};

export default ExploreSkeleton;
