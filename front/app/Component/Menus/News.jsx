'use client'
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNews } from '../../Context/NewsContext';
import MenuSkeleton from '@/app/Skeletons/MenuSkeleton';

const News = ({ showAllNews, setShowAllNews }) => {
  const { news } = useNews();
  const { t } = useTranslation();

  const hasNews = Array.isArray(news) && news.length > 0;

  return (
    <div className="w-full bg-white dark:bg-[#16181c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h2 className="text-lg font-bold text-white">{t('What is happening')}</h2>
      </div>

      {/* Content */}
      {!hasNews ? (
        <MenuSkeleton />
      ) : (
        <div className="flex flex-col w-full">
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
            {news
              .filter((item) => item?.image)
              .slice(0, 5)
              .map((item, index) => (
                <li key={index}>
                  <Link
                    href={item?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 p-4 hover:bg-gray-100 dark:hover:bg-[#1e2025] transition-colors duration-200"
                  >
                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2">
                        {item?.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(item?.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-sm bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={item?.image}
                        alt="news"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                        unoptimized
                      />
                    </div>
                  </Link>
                </li>
              ))}
          </ul>

          {/* Show More Button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-[#1b1d21]">
            <button
              onClick={() => setShowAllNews(true)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {t('Show more')}
              <FaExternalLinkAlt className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
