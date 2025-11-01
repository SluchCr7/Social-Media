'use client';
import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaStar } from 'react-icons/fa';

const TrendingPostCard = memo(({ post, idx, t }) => {
  const photo = useMemo(() => post.Photos?.[0] || null, [post.Photos]);
  const likes = useMemo(() => Array.isArray(post.likes) ? post.likes.length : (post.likes || 0), [post.likes]);
  const comments = useMemo(() => Array.isArray(post.comments) ? post.comments.length : (post.comments || 0), [post.comments]);
  const score = useMemo(() => Math.round(post.score || 0), [post.score]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-lightMode-card dark:bg-darkMode-card rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer"
    >
      <Link href={`/Pages/Post/${post._id}`} className="block">
        {/* Photo preview */}
        <div className="relative w-full h-56 md:h-64 lg:h-72 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {photo ? (
            <Image
              src={photo.url}
              alt={post.title || 'photo'}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL="/blur-placeholder.png"
              priority={idx < 3}
              className="object-cover w-full h-full transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-sm text-lightMode-text2 dark:text-darkMode-text2">
              {t("No photo available")}
            </div>
          )}
          <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
            <FaStar size={12} /> {score}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={post.owner?.profilePhoto?.url || '/default-avatar.png'}
                alt={post.owner?.username || 'author'}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{post.title || post?.owner?.username}</p>
              <p className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate">
                @{post.owner?.profileName} · {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Post text */}
          <p className="text-sm text-lightMode-text dark:text-darkMode-text line-clamp-3">
            {post.text || ''}
          </p>

          {/* Interaction buttons */}
          <div className="flex items-center justify-between mt-2 text-sm text-lightMode-text2 dark:text-darkMode-text2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <FaHeart /> {likes}
              </span>
              <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <FaComment /> {comments}
              </span>
            </div>
            <span className="text-xs text-lightMode-text3 dark:text-darkMode-text3">
              {photo ? t("Photo") : t("No photo")}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
});
TrendingPostCard.displayName = 'TrendingPostCard'
const TrendingTabContent = memo(({ trendingToShow, timeFilter, setTimeFilter, t }) => {
  const filters = useMemo(() => [
    { key: 'today', label: t("Today") },
    { key: 'week', label: t("This Week") },
    { key: 'month', label: t("This Month") }
  ], [t]);

  return (
    <div className="flex flex-col gap-6">
      {/* Time Filter */}
      <div className="flex items-center justify-end gap-3">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeFilter(key)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              timeFilter === key
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid content */}
      {trendingToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingToShow.map((post, idx) => (
            <TrendingPostCard key={post._id || idx} post={post} idx={idx} t={t} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lightMode-text2 dark:text-darkMode-text2 py-12">
          {t("No trending content for the selected timeframe.")}
        </p>
      )}
    </div>
  );
});
TrendingTabContent.displayName = 'TrendingTabContent'
export default TrendingTabContent;
