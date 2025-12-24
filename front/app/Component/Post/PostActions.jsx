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
    className="group flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
  >
    <div className={`p-2 rounded-lg transition-all ${active ? activeColor : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white'}`}>
      <Icon size={18} fill={active ? "currentColor" : "none"} strokeWidth={active ? 2.5 : 2} />
    </div>
    {label !== undefined && (
      <span className={`text-[11px] font-black uppercase tracking-widest ${active ? color : 'text-white/40 group-hover:text-white'}`}>
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
            <Eye size={14} className="text-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{post?.views?.length || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
});

PostActions.displayName = 'PostActions';
export default PostActions;
