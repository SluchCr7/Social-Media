'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiOutlineArrowTopRightOnSquare, HiNewspaper } from 'react-icons/hi2';

const NewsCard = memo(({ item, index, t }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
    >
        <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row gap-5 p-5 rounded-[2rem] bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-xl group"
        >
            {item.image && (
                <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5">
                    <Image
                        src={item.image}
                        alt="News Insight"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                    />
                </div>
            )}

            <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        {new Date(item.publishedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <HiOutlineArrowTopRightOnSquare className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </div>

                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {item.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
                    {item.description || t("Access the full narrative to delve deeper into this unfolding discovery.")}
                </p>
            </div>
        </Link>
    </motion.div>
));

NewsCard.displayName = 'NewsCard';

const DefaultTabContent = ({ news = [], t }) => {
    if (!news?.length) {
        return (
            <div className="py-20 text-center space-y-4 opacity-30">
                <HiNewspaper size={48} className="mx-auto" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em]">{t("Celestial frequencies are quiet. No recent news detected.")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {news.map((item, index) => (
                <NewsCard key={item.url || index} item={item} index={index} t={t} />
            ))}
        </div>
    );
}

export default memo(DefaultTabContent);
