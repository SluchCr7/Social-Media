'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ProfileSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] p-4 md:p-8">
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-[3rem] bg-[#0A0A0A] border border-white/5 shadow-2xl">

        {/* Cover Skeleton */}
        <div className="relative h-64 md:h-80 w-full bg-[#111] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent animate-pulse" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>

        {/* Content Skeleton */}
        <div className="relative px-8 pb-12 -mt-24 md:-mt-32">
          <div className="flex flex-col md:flex-row items-end gap-8">

            {/* Avatar Skeleton */}
            <div className="relative shrink-0">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-[3.5rem] bg-white/5 border-4 border-black animate-pulse shadow-2xl" />
            </div>

            {/* Meta Skeleton */}
            <div className="flex-1 pb-4 flex flex-col gap-3">
              <div className="h-10 md:h-14 w-64 bg-white/5 rounded-2xl animate-pulse" />
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-white/5 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-white/5 rounded-full animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="pb-6">
              <div className="h-14 w-40 bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Bio Skeleton */}
          <div className="mt-12 space-y-4">
            <div className="h-6 w-full max-w-3xl bg-white/5 rounded-xl animate-pulse" />
            <div className="h-6 w-2/3 max-w-xl bg-white/5 rounded-xl animate-pulse" />
          </div>

          {/* XP Dash Skeleton */}
          <div className="mt-12 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-white/5 rounded-full" />
                  <div className="h-5 w-32 bg-white/5 rounded-full" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-6 w-24 bg-white/5 rounded-full ml-auto" />
                <div className="h-2 w-16 bg-white/5 rounded-full ml-auto" />
              </div>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full" />
          </div>

          {/* Stats Skeleton */}
          <div className="flex flex-wrap gap-12 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-8 w-16 bg-white/5 rounded-xl animate-pulse" />
                <div className="h-3 w-20 bg-white/5 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;