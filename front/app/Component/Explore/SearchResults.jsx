'use client';
import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHashtag, HiUser, HiDocumentText, HiChevronRight } from 'react-icons/hi2';

const SearchResults = memo(({ searchResults, searchQuery, user, t, maxResults }) => {
  const { users = [], hashtags = [], posts = [] } = searchResults || {};

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

  if (noResults) {
    return (
      <motion.div
        key="search-no-results"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-center py-20 px-6 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5"
      >
        <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <HiHashtag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
          {t('No signals found')}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('We couldn’t find any matches for')} <span className="text-indigo-500 font-bold">"{searchQuery}"</span>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 👤 Users Section */}
      {!!displayUsers.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <HiUser className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
              {t('Creators & People')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayUsers.map((u) => (
              <Link
                key={u._id}
                href={`/Pages/Profile/${u._id}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 relative flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <Image
                    src={u.profilePhoto?.url || '/default-user.png'}
                    alt={u.username || 'User'}
                    fill
                    className="rounded-2xl object-cover"
                  />
                  {u.isVerify && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                    {u.profileName || u.username}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">
                    @{u.username}
                  </div>
                </div>
                <HiChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🔖 Hashtags Section */}
      {!!displayHashtags.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <HiHashtag className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
              {t('Trending Hashtags')}
            </h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {displayHashtags.map(({ name, count }) => (
              <Link
                key={name}
                href={`/Pages/Hashtag/${encodeURIComponent(name)}`}
                className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  <HiHashtag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                    #{name}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {count} {t('posts')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 📝 Posts Section */}
      {!!displayPosts.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
              <HiDocumentText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
              {t('Network Signals')}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {displayPosts.map((p) => (
              <Link
                key={p._id}
                href={`/Pages/Post/${p._id}`}
                className="group relative block bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl p-6 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative flex items-center gap-4 mb-4">
                  <Image
                    width={40}
                    height={40}
                    src={p.owner?.profilePhoto?.url || '/default-user.png'}
                    alt={p.owner?.username || 'User'}
                    className="rounded-xl object-cover shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors truncate">
                      {p.owner?.profileName || p.owner?.username}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 truncate">
                      @{p.owner?.username}
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="relative text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {p.text || t('Visual Content Signal')}
                </p>
                {p.media && p.media.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {p.media.slice(0, 3).map((m, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/5 overflow-hidden">
                        <img src={m.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';

export default SearchResults;
