'use client'
import Image from 'next/image';
import React from 'react';
import { useNews } from '../Context/NewsContext';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

const News = ({showAllNews ,setShowAllNews}) => {
  const { news } = useNews();

  return (
    <div className="w-full bg-white dark:bg-[#16181c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">What`&apos;`s happening</h2>
      </div>

      <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
        {news
          .filter(item => item?.image)
          .slice(0, 5)
          .map((item, index) => (
            <li key={index}>
              <Link
                href={item?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 hover:bg-gray-100 dark:hover:bg-[#1e2025] transition"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2">
                    {item?.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(item?.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={item?.image}
                    alt="news"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </Link>
            </li>
          ))}
      </ul>
      {
        news.length > 0 && (
          <>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button onClick={()=> setShowAllNews(true)} className="text-sm font-semibold text-blue-500 hover:underline">
                Show more
              </button>
            </div>
          </>
        )
      }
    </div>
  );
};

export default News;
