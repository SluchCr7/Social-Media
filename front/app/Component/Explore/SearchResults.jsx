'use client';
import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResults = memo(({ searchResults, searchQuery, user, t, maxResults }) => {
  const { users = [], hashtags = [], posts = [] } = searchResults || {};

  // ✅ استخدم useMemo لتجنب العمليات المتكررة على نفس البيانات
  const displayUsers = useMemo(() => {
    const filtered = users.filter((u) => u._id !== user?._id);
    return maxResults ? filtered.slice(0, maxResults) : filtered;
  }, [users, user?._id, maxResults]);

  const displayHashtags = useMemo(() => {
    return maxResults ? hashtags.slice(0, maxResults) : hashtags;
  }, [hashtags, maxResults]);

  const displayPosts = useMemo(() => {
    return maxResults ? posts.slice(0, maxResults) : posts;
  }, [posts, maxResults]);

  const noResults =
    displayUsers.length === 0 &&
    displayHashtags.length === 0 &&
    displayPosts.length === 0;

  // ✅ Return مبكر أفضل للأداء
  if (noResults) {
    return (
      <motion.div
        key="search-no-results"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="max-w-2xl mx-auto bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-md p-6 mb-6 text-center"
      >
        <p className="text-lightMode-text2 dark:text-darkMode-text2">
          {t('No results found for')}{' '}
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            {searchQuery}
          </span>
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="search-results-box"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="max-w-2xl mx-auto space-y-5 bg-lightMode-menu dark:bg-darkMode-menu rounded-xl shadow-md p-5 mb-6"
      >
        {/* 👤 المستخدمون */}
        {!!displayUsers.length && (
          <section>
            <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400 border-b dark:border-gray-700 pb-1">
              {t('Users')}
            </h4>
            <ul className="space-y-2">
              {displayUsers.map((u) => (
                <li key={u._id}>
                  <Link
                    href={`/Pages/User/${u._id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
                  >
                    <div className="w-10 h-10 relative flex-shrink-0">
                      <Image
                        src={u.profilePhoto?.url || '/default-avatar.png'}
                        alt={u.username || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10 border border-gray-300 dark:border-gray-600"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-semibold text-lightMode-text dark:text-darkMode-text">
                        {u.username}
                      </span>
                      <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2 truncate">
                        {u.profileName || t('No bio')}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 🔖 الهاشتاجات */}
        {!!displayHashtags.length && (
          <section>
            <h4 className="text-sm font-bold mb-2 text-indigo-600 dark:text-indigo-400 border-b dark:border-gray-700 pb-1">
              {t('Hashtags')}
            </h4>
            <ul className="space-y-1">
              {displayHashtags.map(({ tag, count }) => (
                <li key={tag}>
                  <Link
                    href={`/Pages/Hashtag/${encodeURIComponent(tag)}`}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-lightMode-bg dark:hover:bg-darkMode-bg transition"
                  >
                    <span className="font-medium truncate">#{tag}</span>
                    <span className="text-xs text-lightMode-text2 dark:text-darkMode-text2">
                      {count} {t('posts')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 📝 المنشورات */}
        {!!displayPosts.length && (
          <section>
            <h4 className="text-sm font-bold mb-3 text-indigo-600 dark:text-indigo-400 border-b dark:border-gray-700 pb-1">
              {t('Posts')}
            </h4>
            <ul className="space-y-3">
              {displayPosts.map((p) => (
                <li key={p._id}>
                  <Link
                    href={`/Pages/Post/${p._id}`}
                    className="block bg-lightMode-bg dark:bg-darkMode-bg border border-gray-200 dark:border-gray-700 rounded-xl p-3 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center mb-2">
                      <Image
                        width={32}
                        height={32}
                        src={p.owner?.profilePhoto?.url || '/default-avatar.png'}
                        alt={p.owner?.username || 'User'}
                        className="rounded-full object-cover w-8 h-8 border border-gray-300 dark:border-gray-600 mr-3"
                        loading="lazy"
                      />
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-sm text-lightMode-text dark:text-darkMode-text">
                          {p.owner?.username || t('Unknown User')}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{p.owner?.profileName || 'user'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-lightMode-text dark:text-darkMode-text line-clamp-3">
                      {p.text || t('Untitled Post')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

export default SearchResults;
