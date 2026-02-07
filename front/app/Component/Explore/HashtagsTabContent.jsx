'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { HiArrowTrendingUp, HiArrowTrendingDown, HiHashtag } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const HashtagCard = memo(({ tag, count, index, t }) => {
  const isTrendingUp = index < 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      <Link
        href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
        className="flex items-center justify-between p-6 rounded-[2rem] bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-xl group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <HiHashtag className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-white font-black text-lg sm:text-xl tracking-tight leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {tag}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
              {count} {t('Engagements')}
            </span>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl ${isTrendingUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-indigo-500 bg-indigo-500/10'}`}>
          {isTrendingUp ? <HiArrowTrendingUp className="w-5 h-5" /> : <HiArrowTrendingDown className="w-5 h-5 opacity-50" />}
        </div>
      </Link>
    </motion.div>
  );
});

HashtagCard.displayName = 'HashtagCard';

const HashtagsTabContent = ({ topHashtags = [], t }) => {
  if (!topHashtags?.length) {
    return (
      <div className="py-20 text-center space-y-4 opacity-30">
        <HiHashtag size={48} className="mx-auto" />
        <p className="text-[11px] font-black uppercase tracking-[0.2em]">{t('No trending hashtags currently cataloged.')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
      {topHashtags.map(([tag, count], index) => (
        <HashtagCard
          key={tag}
          tag={tag}
          count={count}
          index={index}
          t={t}
        />
      ))}
    </div>
  );
};

HashtagsTabContent.displayName = 'HashtagsTabContent';
export default memo(HashtagsTabContent);


