'use client';
import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const HashtagsTabContent = ({ topHashtags = [], t }) => {
  // ✅ Memoize rendered items لتجنب إعادة الحساب في كل render
  const hashtagsList = useMemo(() => {
    if (!topHashtags.length) return null;

    return topHashtags.map(([tag, count], index) => {
      const isTrendingUp = index % 2 === 0; // مجرد منطق تجريبي مؤقت
      const trendColor = isTrendingUp
        ? 'bg-green-100 dark:bg-green-800'
        : 'bg-red-100 dark:bg-red-800';
      const trendIcon = isTrendingUp ? (
        <FaArrowUp className="text-green-600 dark:text-green-400 text-sm" />
      ) : (
        <FaArrowDown className="text-red-600 dark:text-red-400 text-sm" />
      );

      return (
        <Link
          key={tag}
          href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
          className="flex justify-between items-center p-4 rounded-xl 
            bg-lightMode-menu dark:bg-darkMode-menu 
            hover:bg-lightMode-bg dark:hover:bg-darkMode-bg 
            shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base">
              #{tag}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {count} {t('posts')}
            </span>
          </div>

          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full ${trendColor}`}
          >
            {trendIcon}
          </div>
        </Link>
      );
    });
  }, [topHashtags, t]);

  // ✅ Return مبسط مع fallback نظيف
  if (!topHashtags.length) {
    return (
      <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-8">
        {t('No trending hashtags right now.')}
      </p>
    );
  }

  return <>{hashtagsList}</>;
};

// ✅ memo يمنع إعادة الرندر إلا إذا تغيّرت props فعلاً
export default memo(HashtagsTabContent);
