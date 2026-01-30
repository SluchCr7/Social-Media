import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsSkeleton = () => (
  <div className="space-y-12 w-full p-6 lg:p-10 max-w-7xl mx-auto min-h-screen bg-[#030712]">
    {/* Header */}
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-4">
      <div className="flex items-center gap-6">
        <div className="relative h-20 w-20 rounded-3xl bg-white/5 animate-pulse overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
          <div className="h-4 w-64 bg-white/5 rounded-full animate-pulse overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 w-full lg:w-auto">
        <div className="h-14 w-full lg:w-48 bg-white/5 rounded-2xl animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="h-14 w-full lg:w-40 bg-white/5 rounded-2xl animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </div>

    {/* KPI Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-40 bg-white/5 rounded-[2.5rem] animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 h-[500px] bg-white/5 rounded-[3rem] animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="lg:col-span-4 h-[500px] bg-white/5 rounded-[3rem] animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
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

export default AnalyticsSkeleton;