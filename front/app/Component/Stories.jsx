'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useStory } from '../Context/StoryContext';
import StoryViewer from './StoryViewer';
import StorySkeleton from '../Skeletons/StoriesSkeleton';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const Stories = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { stories, isLoading, viewStory, setIsStory } = useStory();
  const [viewerStories, setViewerStories] = useState(null);

  // Group stories by owner
  const groupedArray = useMemo(() => {
    if (!stories?.length) return [];

    // Filter: Show my stories + following stories
    const filteredStories = stories.filter(
      story => story?.owner?._id === user?._id || user?.following?.some(f => (f._id || f) === story?.owner?._id)
    );

    const groupedStories = filteredStories.reduce((acc, story) => {
      const userId = story?.owner?._id;
      if (!userId) return acc;
      if (!acc[userId]) acc[userId] = { user: story?.owner, stories: [] };
      acc[userId].stories.push(story);
      return acc;
    }, {});

    // Sort: My story first, then others
    const entries = Object.values(groupedStories).sort((a, b) => {
      if (a.user?._id === user?._id) return -1;
      if (b.user?._id === user?._id) return 1;
      return 0;
    });

    return entries;
  }, [stories, user?._id, user?.following]);

  const handleOpenViewer = (userStories) => {
    setViewerStories(userStories);
    userStories.forEach(story => viewStory(story._id));
  };

  const hasUnseen = (groupStories) => {
    return groupStories.some(story => !story?.views?.some(v => (v._id || v) === user?._id));
  };

  const getBorderStyle = (groupStories) => {
    const total = groupStories.length;
    const unseenColors = "conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #6366f1)";
    const seenColors = "conic-gradient(from 0deg, #333, #444, #333)";

    if (total === 1) {
      return hasUnseen(groupStories) ? unseenColors : seenColors;
    }

    const step = 360 / total;
    let gradients = [];
    groupStories.forEach((story, i) => {
      const start = i * step + 2;
      const end = (i + 1) * step - 2;
      const unseen = !story?.views?.some(v => (v._id || v) === user?._id);
      gradients.push(`${unseen ? "#a855f7" : "#444"} ${start}deg ${end}deg`);
      gradients.push(`transparent ${end}deg ${(i + 1) * step}deg`);
    });
    return `conic-gradient(${gradients.join(", ")})`;
  };

  return (
    <div className="w-full py-4 md:py-8 select-none">
      <div className="flex items-center gap-4 md:gap-7 overflow-x-auto no-scrollbar snap-x px-4 md:px-0">

        {/* CREATE STORY TRIGGER */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsStory(true)}
          className="flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start group"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2.2rem] p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/10">
            <div className="w-full h-full rounded-[1.6rem] md:rounded-[2rem] bg-[#0A0A0A] flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all overflow-hidden relative">
              {user?.profilePhoto?.url ? (
                <Image src={user.profilePhoto.url} fill alt="user" className="object-cover opacity-40 blur-[1px] group-hover:scale-110 transition-transform duration-500" />
              ) : null}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <FiPlus size={20} className="md:size-[24px]" />
              </div>
            </div>
          </div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">{t("Start")}</span>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <StorySkeleton key={i} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {groupedArray.map((group, index) => {
              const isMine = group.user?._id === user?._id;
              const unseen = hasUnseen(group.stories);

              return (
                <motion.div
                  key={group.user?._id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.03 }}
                  onClick={() => handleOpenViewer(group.stories)}
                  className="flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start group relative"
                >
                  <div
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2.2rem] p-[3px] shadow-xl transition-all duration-500 group-hover:shadow-purple-500/20"
                    style={{ background: getBorderStyle(group.stories) }}
                  >
                    <div className="w-full h-full rounded-[1.6rem] md:rounded-[2rem] bg-black p-[2px]">
                      <div className="relative w-full h-full rounded-[1.4rem] md:rounded-[1.8rem] overflow-hidden border border-white/5">
                        <Image
                          src={group?.user?.profilePhoto?.url || '/default-profile.png'}
                          alt={group?.user?.username}
                          fill
                          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${unseen ? 'grayscale-0' : 'grayscale-[0.3]'}`}
                        />
                      </div>
                    </div>

                    {/* Multiple Stories Badge */}
                    {group.stories.length > 1 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-lg bg-white text-black text-[9px] md:text-[10px] font-black flex items-center justify-center border-2 border-black shadow-lg z-20">
                        {group.stories.length}
                      </div>
                    )}

                    {/* Live indicator for others */}
                    {!isMine && unseen && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-indigo-600 text-[6px] font-black text-white uppercase tracking-tighter border border-white/10 whitespace-nowrap z-20 shadow-lg">
                        {t("Live")}
                      </span>
                    )}
                  </div>

                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest truncate w-16 md:w-20 text-center transition-colors ${unseen ? 'text-white/80' : 'text-white/30 group-hover:text-white/50'}`}>
                    {isMine ? t('You') : group?.user?.username}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* STORY VIEWER PORTAL */}
      <AnimatePresence>
        {viewerStories && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
          >
            <StoryViewer
              stories={viewerStories}
              onClose={() => setViewerStories(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stories;
