'use client';

import React from 'react';
import { usePost } from '../../Context/PostContext';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';
import Link from 'next/link';
import { filterHashtags } from '../../utils/filterHashtags';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const HashtagsMenu = React.memo(() => {
  const { posts } = usePost();
  const { t } = useTranslation()

  const hashtagCount = {};
  filterHashtags(posts, hashtagCount);

  const topHashtags = Object.entries(hashtagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col">

      {/* ⚡ Header */}
      <div className="px-7 pt-7 pb-4">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
          {t("Trending Now")}
        </h2>
      </div>

      {/* 🚀 Body */}
      <div className="flex flex-col w-full px-4 pb-6 space-y-1">
        {topHashtags.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-gray-400 dark:text-gray-500 text-sm font-medium">
            {t("No trends found yet.")}
          </div>
        ) : (
          topHashtags
            .slice(0, 4)
            .map(([tag, count], index) => {
              const isTrendingUp = index % 2 === 0;

              return (
                <Link
                  key={tag}
                  href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                  className="group flex justify-between items-center p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-gray-100 font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      #{tag}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
                      {count} {t("posts")}
                    </span>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`flex items-center justify-center w-9 h-9 rounded-xl ${isTrendingUp ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}
                  >
                    {isTrendingUp ? (
                      <HiArrowTrendingUp size={18} />
                    ) : (
                      <HiArrowTrendingDown size={18} />
                    )}
                  </motion.div>
                </Link>
              );
            })
        )}
      </div>

      {/* Footer Link */}
      <div className="px-7 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <button className="text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors tracking-wide uppercase">
          Explore all trends
        </button>
      </div>
    </div>
  );
});

HashtagsMenu.displayName = 'HashtagsMenu'
export default HashtagsMenu;
