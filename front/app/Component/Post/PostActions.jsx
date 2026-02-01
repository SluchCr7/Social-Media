'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, Bookmark, Repeat, Eye } from 'lucide-react';

const ActionButton = React.memo(({ onClick, icon: Icon, label, active, color, activeColor }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group flex items-center gap-1.5 sm:gap-2 px-1.5 py-1.5 sm:px-2 sm:py-1.5 rounded-xl transition-all"
  >
    <div className={`p-2 rounded-lg transition-all ${active ? activeColor : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 group-hover:bg-gray-200 dark:group-hover:bg-white/10 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
      <Icon size={18} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" fill={active ? "currentColor" : "none"} strokeWidth={active ? 2.5 : 2} />
    </div>
    {label !== undefined && (
      <span className={`text-[11px] font-black uppercase tracking-widest ${active ? color : 'text-gray-400 dark:text-white/40 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
        {label}
      </span>
    )}
  </motion.button>
));

ActionButton.displayName = 'ActionButton';

const PostActions = React.memo(({ post, user, likePost, hahaPost, sharePost, savePost, setOpenModel }) => {
  const isInPostPage = useMemo(() => typeof window !== 'undefined' && window.location.pathname.startsWith('/Pages/Post/'), []);
  const userId = user?._id;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {/* Like Action */}
        <ActionButton
          onClick={() => likePost(post?._id, post?.owner._id)}
          icon={Heart}
          label={post?.likes?.length || 0}
          active={post?.likes?.includes(userId)}
          color="text-red-500"
          activeColor="bg-red-500/10 text-red-500"
        />

        {/* Comment Action */}
        {!post?.isCommentOff && (
          isInPostPage ? (
            <ActionButton
              icon={MessageSquare}
              label={post?.comments?.length || 0}
            />
          ) : (
            <Link href={`/Pages/Post/${post?._id}`}>
              <ActionButton
                icon={MessageSquare}
                label={post?.comments?.length || 0}
              />
            </Link>
          )
        )}

        {/* Repost/Share internally */}
        <ActionButton
          onClick={() => setOpenModel(true)}
          icon={Repeat}
          label={post?.shares?.length > 0 ? post.shares.length : undefined}
          active={post?.shares?.some(s => s.user === userId)}
          color="text-green-500"
          activeColor="bg-green-500/10 text-green-500"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* External Share */}
        <ActionButton
          onClick={() => sharePost(post?.originalPost ? post.originalPost._id : post._id, post?.owner?._id)}
          icon={Share2}
        />

        {/* Save Action */}
        <ActionButton
          onClick={() => savePost(post?._id)}
          icon={Bookmark}
          active={post?.saved?.includes(userId)}
          color="text-yellow-500"
          activeColor="bg-yellow-500/10 text-yellow-500"
        />

        {/* Views (Owner Only) */}
        {userId === post?.owner?._id && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <Eye size={14} className="text-gray-400 dark:text-white/20" />
            <span className="text-[10px] font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">{post?.views?.length || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
});

PostActions.displayName = 'PostActions';
export default PostActions;
