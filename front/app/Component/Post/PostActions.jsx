'use client';

import React, { useMemo, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Repeat, 
  Eye,
  BarChart2
} from 'lucide-react';

const ActionButton = memo(({ onClick, icon: Icon, label, active, color, activeColor }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`
      group flex items-center gap-2 p-2 rounded-full transition-all
      ${active ? activeColor : 'text-gray-500 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5'}
    `}
  >
    <div className="relative">
      <Icon 
        size={20} 
        className="transition-all duration-300"
        fill={active ? "currentColor" : "none"} 
        strokeWidth={active ? 2.5 : 2} 
      />
      {active && (
        <motion.div
          layoutId="action-pulse"
          className="absolute inset-0 bg-current rounded-full blur-md opacity-20"
        />
      )}
    </div>
    {label !== undefined && (
      <span className={`text-[13px] font-bold ${active ? color : 'text-gray-500 dark:text-white/40 group-hover:text-black dark:group-hover:text-white'}`}>
        {label}
      </span>
    )}
  </motion.button>
));

ActionButton.displayName = 'ActionButton';

const PostActions = memo(({ post, user, likePost, hahaPost, sharePost, savePost, setOpenModel }) => {
  const userId = user?._id;
  const isLiked = post?.likes?.includes(userId);
  const isSaved = post?.saved?.includes(userId);
  const isShared = post?.shares?.some(s => s.user === userId);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-1 sm:gap-4">
        {/* Like Action */}
        <ActionButton
          onClick={() => likePost(post?._id, post?.owner?._id)}
          icon={Heart}
          label={post?.likes?.length || 0}
          active={isLiked}
          color="text-rose-500"
          activeColor="text-rose-500 bg-rose-500/10"
        />

        {/* Comment Action */}
        {!post?.isCommentOff && (
          <Link href={`/Pages/Post/${post?._id}`}>
            <ActionButton
              icon={MessageSquare}
              label={post?.comments?.length || 0}
            />
          </Link>
        )}

        {/* Repost/Share internally */}
        <ActionButton
          onClick={() => setOpenModel(true)}
          icon={Repeat}
          label={post?.shares?.length > 0 ? post.shares.length : undefined}
          active={isShared}
          color="text-emerald-500"
          activeColor="text-emerald-500 bg-emerald-500/10"
        />
        
        {/* External Share */}
        <ActionButton
          onClick={() => sharePost(post?.originalPost ? post.originalPost._id : post._id, post?.owner?._id)}
          icon={Share2}
        />
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        {/* Views / Stats */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all group">
           <BarChart2 size={16} className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
           <span className="text-[12px] font-bold text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
             {post?.views?.length || 0}
           </span>
        </div>

        {/* Save Action */}
        <ActionButton
          onClick={() => savePost(post?._id)}
          icon={Bookmark}
          active={isSaved}
          color="text-amber-500"
          activeColor="text-amber-500 bg-amber-500/10"
        />
      </div>
    </div>
  );
});

PostActions.displayName = 'PostActions';

export default PostActions;
