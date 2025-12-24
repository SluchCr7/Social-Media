'use client';

import React, { memo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { BsThreeDots } from 'react-icons/bs';
import { HiBadgeCheck } from 'react-icons/hi';
import PostMenu from '@/app/Component/PostMenu';
import UserHoverCard from '../UserHoverCard';
import { formatRelativeTime } from '@/app/utils/FormatDataCreatedAt';

const PostHeader = memo(({ post, user, isLogin, showMenu, setShowMenu, isCommunityPost }) => {
  const owner = post?.owner;
  const triggerRef = useRef(null);

  const handleToggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, [setShowMenu]);

  const userProfileLink = user?._id === owner?._id
    ? '/Pages/Profile'
    : `/Pages/User/${owner?._id}`;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        {/* User Avatar - Professional Scale */}
        <UserHoverCard userSelected={owner}>
          <Link href={userProfileLink} className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shrink-0 group">
            <img
              src={owner?.profilePhoto?.url || '/default-profile.png'}
              alt={owner?.username}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
          </Link>
        </UserHoverCard>

        {/* Identity & Metadata */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <UserHoverCard userSelected={owner}>
              <Link
                href={userProfileLink}
                className="text-white font-black text-sm tracking-tight hover:text-indigo-400 transition-colors"
              >
                {owner?.username || 'Phantom'}
              </Link>
            </UserHoverCard>
            {owner?.isAccountWithPremiumVerify && (
              <HiBadgeCheck className="text-indigo-500 text-lg" title="Verified Asset" />
            )}
            <span className="text-[10px] text-white/30 font-black uppercase tracking-widest ml-1">
              • {formatRelativeTime(post?.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white/40 truncate max-w-[120px]">@{owner?.profileName || owner?.username}</span>
            {isCommunityPost && (
              <>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">In Community</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Options Menu */}
      {isLogin && (
        <div className="relative">
          <button
            ref={triggerRef}
            onClick={handleToggleMenu}
            className="w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5"
          >
            <BsThreeDots size={18} />
          </button>
          <PostMenu
            post={post}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            triggerRef={triggerRef}
          />
        </div>
      )}
    </div>
  );
});

PostHeader.displayName = 'PostHeader';
export default PostHeader;
