'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHashtag, HiUser, HiDocumentText, HiChevronRight, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-20 px-8 rounded-[3rem] bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 backdrop-blur-3xl shadow-2xl"
      >
        <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500">
          <HiOutlineMagnifyingGlass className="w-12 h-12 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
          {t('Signals Lost')}
        </h3>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
          {t('No matches found for')} <span className="text-indigo-600 dark:text-indigo-400">{searchQuery}</span>. {t('Refine your narrative.')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-16">
      {/* 👤 Creators Segment */}
      {!!displayUsers.length && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HiUser className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
              {t('Identified Entities')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUsers.map((u, i) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/Pages/Profile/${u._id}`}
                  className="group flex items-center gap-5 p-5 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl"
                >
                  <div className="w-14 h-14 relative flex-shrink-0">
                    <Image
                      src={u.profilePhoto?.url || '/default-user.png'}
                      alt={u.username}
                      fill
                      className="rounded-2xl object-cover ring-4 ring-indigo-500/5 group-hover:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm text-gray-900 dark:text-white truncate tracking-tight uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {u.profileName || u.username}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest mt-0.5">
                      @{u.username}
                    </div>
                  </div>
                  <HiChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 🔖 Taxonomic Segment */}
      {!!displayHashtags.length && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HiHashtag className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
              {t('Conceptual Hubs')}
            </h4>
          </div>
          <div className="flex flex-wrap gap-4">
            {displayHashtags.map(({ name, count }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/Pages/Hashtag/${encodeURIComponent(name)}`}
                  className="group flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-purple-500/30 transition-all duration-500 shadow-sm hover:shadow-xl"
                >
                  <div className="text-purple-600 dark:text-purple-400 group-hover:scale-125 transition-transform">
                    <HiHashtag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {name}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                      {count} {t('Observations')}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 📝 Intelligence Segment */}
      {!!displayPosts.length && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HiDocumentText className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
              {t('Recorded Narratives')}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayPosts.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/Pages/Post/${p._id}`}
                  className="group relative flex flex-col p-8 rounded-[3rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 relative">
                      <Image
                        src={p.owner?.profilePhoto?.url || '/default-user.png'}
                        alt={p.owner?.username}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {p.owner?.profileName || p.owner?.username}
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        @{p.owner?.username}
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-gray-300 dark:text-white/5 uppercase tracking-[0.2em]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-600 dark:text-white/60 line-clamp-3 leading-relaxed mb-6 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {p.text || t('Visual data stream transmitted.')}
                  </p>

                  {p.media?.length > 0 && (
                    <div className="flex gap-2">
                      {p.media.slice(0, 4).map((m, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden">
                          <Image
                            src={m.url}
                            alt="Intel"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';
export default SearchResults;

