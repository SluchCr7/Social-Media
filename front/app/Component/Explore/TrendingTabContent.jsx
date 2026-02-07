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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col rounded-[3rem] bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl transition-all hover:shadow-indigo-500/10 hover:border-indigo-500/20"
    >
      <Link href={`/Pages/Post/${post._id}`} className="block h-full">
        {/* 🖼 Media Frame */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-[#111]">
          {photo ? (
            <Image
              src={photo.url}
              alt="Discovery Asset"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-gray-200 dark:text-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <IoDiamondOutline size={48} />
              <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em]">Pure Narrative</p>
            </div>
          )}

          {/* Gradient Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Score Badge */}
          <div className="absolute top-5 left-5">
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center gap-2 shadow-sm">
              <FaFire className="text-orange-500 text-xs animate-pulse" />
              <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{score}</span>
            </div>
          </div>
        </div>

        {/* 📝 Content & Intel */}
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 ring-4 ring-indigo-500/5">
              <Image
                src={post.owner?.profilePhoto?.url || '/default-avatar.png'}
                alt="Author"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 dark:text-white truncate tracking-tight uppercase">{post?.owner?.username}</p>
              <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest">@{post?.owner?.profileName}</p>
            </div>
          </div>

          <p className="text-base font-bold text-gray-700 dark:text-white/70 line-clamp-2 leading-relaxed h-[3rem] mb-6">
            {post.text || t('Discovering the depths of creativity...')}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-rose-500 font-black text-[11px]">
                <FaHeart size={14} className="group-hover:scale-125 transition-transform" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-500 font-black text-[11px]">
                <FaComment size={14} className="group-hover:scale-125 transition-transform" />
                <span>{comments}</span>
              </div>
            </div>
            <span className="text-[9px] font-black text-gray-300 dark:text-white/10 uppercase tracking-[0.2em]">
              {new Date(post.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

TrendingPostCard.displayName = 'TrendingPostCard';

const TrendingTabContent = memo(({ trendingToShow, timeFilter, setTimeFilter, t }) => {
  const filters = useMemo(() => [
    { key: 'today', label: t("24 Hours") },
    { key: 'week', label: t("7 Days") },
    { key: 'month', label: t("30 Days") }
  ], [t]);

  return (
    <div className="flex flex-col gap-12">
      {/* 🕰 Time Control */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-[1.5rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 w-fit">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeFilter(key)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${timeFilter === key
              ? 'bg-white dark:bg-white text-black shadow-lg scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 🌋 Discovery Grid */}
      {trendingToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {trendingToShow.map((post, idx) => (
            <TrendingPostCard key={post._id || idx} post={post} idx={idx} t={t} />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/[0.03] flex items-center justify-center text-gray-200 dark:text-white/5">
            <IoDiamondOutline size={40} className="animate-spin-slow" />
          </div>
          <p className="max-w-xs text-[11px] font-black uppercase tracking-[0.3em] text-gray-400/50 leading-relaxed">
            {t('Quantum observation failed. No orbital content for this timeframe.')}
          </p>
        </div>
      )}
    </div>
  );
});

TrendingTabContent.displayName = 'TrendingTabContent';
export default TrendingTabContent;

