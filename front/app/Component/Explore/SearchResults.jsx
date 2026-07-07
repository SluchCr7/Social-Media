'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiHashtag, HiUser, HiDocumentText, HiChevronRight, HiOutlineMagnifyingGlass, HiUserGroup } from 'react-icons/hi2';

const SearchResults = memo(({ searchResults, searchQuery, user, t, maxResults }) => {
  const { users = [], hashtags = [], posts = [], communities = [] } = searchResults || {};

  const displayUsers = useMemo(() => {
    const filtered = users.filter((u) => u._id !== user?._id);
    return maxResults ? filtered.slice(0, maxResults) : filtered;
  }, [users, user?._id, maxResults]);

  const displayCommunities = useMemo(() => {
    return maxResults ? communities.slice(0, maxResults) : communities;
  }, [communities, maxResults]);

  const displayHashtags = useMemo(() => {
    return maxResults ? hashtags.slice(0, maxResults) : hashtags;
  }, [hashtags, maxResults]);

  const displayPosts = useMemo(() => {
    return maxResults ? posts.slice(0, maxResults) : posts;
  }, [posts, maxResults]);

  const noResults =
    displayUsers.length === 0 &&
    displayCommunities.length === 0 &&
    displayHashtags.length === 0 &&
    displayPosts.length === 0;

  if (noResults) {
    return (
      <motion.div
        key="search-no-results"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-16 px-6 rounded-[2.5rem] bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/5 backdrop-blur-3xl shadow-lg"
      >
        <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-6">
          <HiOutlineMagnifyingGlass className="w-10 h-10 text-slate-300 dark:text-slate-650" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          {t('No Matches Found')}
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          {t('No signals matching')} <span className="text-indigo-500">{searchQuery}</span>. {t('Try refining your query.')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 👤 Creators Segment */}
      {!!displayUsers.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <HiUser className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-450">
              {t('Identified Creators')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayUsers.map((u, i) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/Pages/Profile/${u._id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-150 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={u.profilePhoto?.url || '/default-user.png'}
                      alt={u.username}
                      fill
                      className="rounded-xl object-cover ring-2 ring-indigo-500/5 group-hover:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-550 transition-colors">
                      {u.profileName || u.username}
                    </div>
                    <div className="text-[9px] font-black text-slate-400 truncate uppercase tracking-widest mt-0.5">
                      @{u.username}
                    </div>
                  </div>
                  <HiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 🏘 Communities Segment */}
      {!!displayCommunities.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <HiUserGroup className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-450">
              {t('Communities')}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCommunities.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/Pages/Community/${c._id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-150 dark:border-white/5 hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={c.Picture?.url || '/default-community.png'}
                      alt={c.Name}
                      fill
                      className="rounded-xl object-cover ring-2 ring-emerald-500/5 group-hover:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-550 transition-colors">
                      {c.Name}
                    </div>
                    <div className="text-[9px] font-black text-slate-400 truncate uppercase tracking-widest mt-0.5">
                      {c.membersCount || 0} {t('Members')}
                    </div>
                  </div>
                  <HiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-550 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 🔖 Hashtags Segment */}
      {!!displayHashtags.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <HiHashtag className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-450">
              {t('Hashtag Hubs')}
            </h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {displayHashtags.map(({ name, count }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  href={`/Pages/Hashtag/${encodeURIComponent(name)}`}
                  className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-white/[0.01] border border-slate-150 dark:border-white/5 hover:border-purple-500/35 transition-all duration-300 shadow-sm"
                >
                  <div className="text-purple-500 group-hover:scale-110 transition-transform">
                    <HiHashtag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-800 dark:text-white group-hover:text-purple-500 transition-colors text-xs">
                      #{name}
                    </span>
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-2">
                      {count} {t('posts')}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 📝 Posts Segment */}
      {!!displayPosts.length && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
              <HiDocumentText className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-450">
              {t('Recorded Posts')}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPosts.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/Pages/Post/${p._id}`}
                  className="group relative flex flex-col p-5 rounded-3xl bg-white dark:bg-white/[0.01] border border-slate-150 dark:border-white/5 hover:border-pink-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={p.owner?.profilePhoto?.url || '/default-user.png'}
                        alt={p.owner?.username}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-[11px] text-slate-900 dark:text-white truncate group-hover:text-pink-500 transition-colors">
                        {p.owner?.profileName || p.owner?.username}
                      </div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        @{p.owner?.username}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {p.text || t('Visual post stream shared.')}
                  </p>
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
