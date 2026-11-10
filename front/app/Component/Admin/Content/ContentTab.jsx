'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiDocumentText,
  HiChatBubbleLeftRight,
  HiUserGroup,
  HiFilm,
  HiTrash,
  HiMagnifyingGlass,
  HiArrowPath,
  HiChevronLeft,
  HiChevronRight,
  HiCalendar,
  HiHeart,
} from 'react-icons/hi2';
import Image from 'next/image';
import { useAdmin } from '@/app/redux/hooks';
import { useTranslation } from 'react-i18next';

export default function ContentTab() {
  const { t } = useTranslation();
  const {
    contentTab,
    setContentTab,
    contentSearch,
    setContentSearch,
    contentPage,
    setContentPage,
    contentItems,
    contentTotal,
    contentTotalPages,
    isContentLoading,
    deleteContentItem,
    refetchContent,
  } = useAdmin();

  const tabs = [
    { id: 'posts', label: t('Posts'), icon: <HiDocumentText className="w-5 h-5" /> },
    { id: 'comments', label: t('Comments'), icon: <HiChatBubbleLeftRight className="w-5 h-5" /> },
    { id: 'communities', label: t('Communities'), icon: <HiUserGroup className="w-5 h-5" /> },
    { id: 'reels', label: t('Reels'), icon: <HiFilm className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full p-6 md:p-10 space-y-8">
      {/* 🎯 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
            {t('Content')} <span className="text-indigo-500">{t('Moderation')}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            {t('Review, inspect, and moderate posts, comments, communities, and short videos')}
          </p>
        </div>

        {/* 🔍 Search & Sync */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t(`Search ${contentTab}...`)}
              value={contentSearch}
              onChange={(e) => setContentSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => refetchContent()}
            disabled={isContentLoading}
            className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
            title={t('Refresh')}
          >
            <HiArrowPath className={`w-5 h-5 ${isContentLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 🏷 Content Category Selector */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/5 pb-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setContentTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
              contentTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <div className="ml-auto text-xs font-bold text-gray-400">
          {t('Total')}: {contentTotal}
        </div>
      </div>

      {/* 📦 Items Grid */}
      {isContentLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Loading content...')}</p>
        </div>
      ) : contentItems.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-3xl p-10">
          <HiDocumentText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('No content found')}</h3>
          <p className="text-sm text-gray-400 mt-1">{t('No matching items in this category.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {contentItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300"
              >
                {/* Author info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-gray-100 dark:bg-white/5 flex-shrink-0">
                    <Image
                      src={item.owner?.profilePhoto?.url || '/default-profile.png'}
                      alt={item.owner?.username || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {item.owner?.username || t('Anonymous')}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <HiCalendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="mb-4 flex-1">
                  {contentTab === 'communities' ? (
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">{item.Name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-3">{item.Description || t('No description')}</p>
                      <div className="mt-3 text-xs font-semibold text-indigo-500">
                        {item.members?.length || 0} {t('members')}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 mb-3">
                        {item.text || item.caption || t('[No text provided]')}
                      </p>
                      {item.Photos?.[0]?.url && (
                        <div className="w-full h-40 relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 mb-2">
                          <Image src={item.Photos[0].url} alt="Media" fill className="object-cover" />
                        </div>
                      )}
                      {item.video?.url && (
                        <div className="w-full h-40 relative rounded-2xl overflow-hidden bg-black mb-2 flex items-center justify-center text-white text-xs">
                          <HiFilm className="w-8 h-8 opacity-60" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div className="text-xs text-gray-400 flex items-center gap-3">
                    {item.likes && (
                      <span className="flex items-center gap-1">
                        <HiHeart className="w-4 h-4 text-rose-500" />
                        {item.likes.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const typeMap = {
                        posts: 'post',
                        comments: 'comment',
                        communities: 'community',
                        reels: 'reel',
                      };
                      deleteContentItem(typeMap[contentTab], item._id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                    {t('Delete')}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 📄 Pagination */}
      {contentTotalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setContentPage(Math.max(1, contentPage - 1))}
            disabled={contentPage === 1}
            className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {contentPage} / {contentTotalPages}
          </span>
          <button
            onClick={() => setContentPage(Math.min(contentTotalPages, contentPage + 1))}
            disabled={contentPage === contentTotalPages}
            className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
