'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useStory } from '../Context/StoryContext';
import StoryViewer from './StoryViewer';
import StorySkeleton from '../Skeletons/StoriesSkeleton';
import { useAuth } from '../Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const Stories = () => {
  const { user } = useAuth();
  const { stories, isLoading, viewStory, setIsStory } = useStory();
  const [viewerStories, setViewerStories] = useState(null);

  const groupedArray = useMemo(() => {
    if (!stories?.length) return [];
    const filteredStories = stories.filter(
      story => story?.owner?._id === user?._id || user?.following?.includes(story?.owner?._id)
    );
    const groupedStories = filteredStories.reduce((acc, story) => {
      const userId = story?.owner?._id;
      if (!acc[userId]) acc[userId] = { user: story?.owner, stories: [] };
      acc[userId].stories.push(story);
      return acc;
    }, {});
    return Object.values(groupedStories);
  }, [stories, user?._id, user?.following]);

  const handleOpenViewer = (userStories) => {
    setViewerStories(userStories);
    userStories.forEach(story => viewStory(story._id));
  };

  const getBorderStyle = (stories, userId) => {
    const total = stories.length;
    if (total === 1) {
      const unseen = !stories[0]?.views?.some(v => v?._id === userId);
      return unseen ? "conic-gradient(#6366f1, #a855f7, #ec4899)" : "conic-gradient(#333, #333)";
    }
    const step = 360 / total;
    let gradients = [];
    stories.forEach((story, i) => {
      const start = i * step + 2;
      const end = (i + 1) * step - 2;
      const unseen = !story?.views?.some(v => v?._id === userId);
      gradients.push(`${unseen ? "#6366f1" : "#333"} ${start}deg ${end}deg`);
      gradients.push(`transparent ${end}deg ${(i + 1) * step}deg`);
    });
    return `conic-gradient(${gradients.join(", ")})`;
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">

        {/* Create Your Story */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsStory(true)}
          className="flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start"
        >
          <div className="relative w-20 h-20 rounded-[2rem] p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/10">
            <div className="w-full h-full rounded-[1.8rem] bg-[#0A0A0A] flex items-center justify-center border border-white/10 group overflow-hidden">
              {user?.profilePhoto?.url ? (
                <div className="relative w-full h-full opacity-40 group-hover:opacity-60 transition-opacity">
                  <Image src={user.profilePhoto.url} fill alt="user" className="object-cover blur-[2px]" />
                </div>
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl">
                  <FiPlus size={24} />
                </div>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Launch</span>
        </motion.div>

        {/* User Stories */}
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <StorySkeleton key={i} />)
        ) : (
          groupedArray.map((group, index) => (
            <motion.div
              key={group.user?._id || index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleOpenViewer(group.stories)}
              className="flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start group"
            >
              <div
                className="relative w-20 h-20 rounded-[2rem] p-[3px] shadow-2xl transition-all group-hover:shadow-indigo-500/20"
                style={{ background: getBorderStyle(group.stories, user?._id) }}
              >
                <div className="w-full h-full rounded-[1.8rem] bg-black p-1">
                  <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-white/5">
                    <Image
                      src={group?.user?.profilePhoto?.url || '/default-profile.png'}
                      alt={group?.user?.username}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                {group.stories.length > 1 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-white text-black text-[10px] font-black flex items-center justify-center border-2 border-black shadow-lg">
                    {group.stories.length}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 truncate w-20 text-center">
                {group?.user?.username}
              </span>
            </motion.div>
          ))
        )}
      </div>

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
