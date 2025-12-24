'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaFire } from 'react-icons/fa';
import { IoDiamondOutline } from 'react-icons/io5';

const TrendingPostCard = memo(({ post, idx, t }) => {
  const photo = useMemo(() => post.Photos?.[0] || null, [post.Photos]);
  const likes = useMemo(() => Array.isArray(post.likes) ? post.likes.length : (post.likes || 0), [post.likes]);
  const comments = useMemo(() => Array.isArray(post.comments) ? post.comments.length : (post.comments || 0), [post.comments]);
  const score = useMemo(() => Math.round(post.score || 0), [post.score]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-white/10"
    >
      <Link href={`/Pages/Post/${post._id}`} className="block h-full">
        {/* Visual Asset Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
          {photo ? (
            <Image
              src={photo.url}
              alt="asset"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <IoDiamondOutline size={64} />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em]">Pure Spectrum Post</p>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <FaFire className="text-orange-500 text-xs shadow-xl" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{score}</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 ring-4 ring-indigo-500/10">
              <img src={post.owner?.profilePhoto?.url || '/default-avatar.png'} alt="av" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate tracking-tight">{post?.owner?.username}</p>
              <p className="text-[10px] font-bold text-white/30 truncate uppercase tracking-widest">@{post?.owner?.profileName}</p>
            </div>
          </div>

          <p className="text-sm font-bold text-white/80 line-clamp-2 leading-relaxed h-10 mb-4">
            {post.text || 'Insightful narrative from the creator hub...'}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-red-500/60 font-black text-[10px]">
                <FaHeart size={12} />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-500/60 font-black text-[10px]">
                <FaComment size={12} />
                <span>{comments}</span>
              </div>
            </div>
            <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em]">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

TrendingPostCard.displayName = 'TrendingPostCard';

const TrendingTabContent = memo(({ trendingToShow, timeFilter, setTimeFilter, t }) => {
  const filters = useMemo(() => [
    { key: 'today', label: t("Daily") },
    { key: 'week', label: t("Weekly") },
    { key: 'month', label: t("Monthly") }
  ], [t]);

  return (
    <div className="flex flex-col gap-10">
      {/* Time Filter Hub */}
      <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1 rounded-2xl w-fit mx-auto md:mx-0">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeFilter(key)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === key
                ? 'bg-white text-black shadow-lg'
                : 'text-white/30 hover:text-white/60'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dynamic Grid Layout */}
      {trendingToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trendingToShow.map((post, idx) => (
            <TrendingPostCard key={post._id || idx} post={post} idx={idx} t={t} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center opacity-20">
          <IoDiamondOutline size={48} />
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest">No orbital content detected for this timeframe</p>
        </div>
      )}
    </div>
  );
});

TrendingTabContent.displayName = 'TrendingTabContent';
export default TrendingTabContent;
