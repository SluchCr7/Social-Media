'use client'
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { useNews } from '../../Context/NewsContext';
import MenuSkeleton from '@/app/Skeletons/MenuSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const News = ({ showAllNews, setShowAllNews }) => {
  const { news } = useNews();
  const { t } = useTranslation();

  const hasNews = Array.isArray(news) && news.length > 0;

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-500">
      {/* 📰 Header */}
      <div className="px-7 pt-7 pb-4">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-600 dark:bg-purple-500 rounded-full" />
          {t('Global Pulse')}
        </h2>
      </div>

      {/* 🏮 Content */}
      <AnimatePresence mode="wait">
        {!hasNews ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="skeleton"
          >
            <MenuSkeleton />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="content"
            className="flex flex-col w-full"
          >
            <ul className="flex flex-col px-4 pb-2">
              {news
                .filter((item) => item?.image)
                .slice(0, 4)
                .map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <Link
                      href={item?.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                    >
                      {/* Image container with subtle glow */}
                      <div className="w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm bg-gray-100 dark:bg-gray-800 relative">
                        <Image
                          src={item?.image}
                          alt="news"
                          fill
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item?.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            {new Date(item?.publishedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                          <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                            News
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
            </ul>

            {/* 🔥 Show More Button */}
            <div className="px-7 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <button
                onClick={() => setShowAllNews(true)}
                className="group inline-flex items-center gap-2 text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all uppercase tracking-wide"
              >
                {t('Expand universe')}
                <HiArrowTopRightOnSquare className="text-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
