'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { BsThreeDots, BsLink45Deg } from 'react-icons/bs';
import { HiBadgeCheck } from 'react-icons/hi';
import PostMenu from '@/app/Component/PostMenu';
import UserHoverCard from '../UserHoverCard';
import { formatRelativeTime } from '@/app/utils/FormatDataCreatedAt';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useRef } from 'react';
const PostHeader = memo(({ post, user, isLogin, showMenu, setShowMenu, isCommunityPost }) => {
  const owner = post?.owner;
  const triggerRef = useRef(null);

  const handleToggleMenu = useCallback((e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  }, [setShowMenu]);

  const userProfileLink = user?._id === owner?._id
    ? '/Pages/Profile'
    : `/Pages/User/${owner?._id}`;

  return (
    <div className="flex items-center justify-between w-full group/header">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* User Avatar - Premium Frame */}
        <UserHoverCard userSelected={owner}>
          <Link href={userProfileLink} className="relative shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-[1.25rem] sm:rounded-2xl p-[2px] bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 overflow-hidden"
            >
              <div className="relative w-full h-full rounded-[1.1rem] sm:rounded-[1.4rem] overflow-hidden bg-white dark:bg-[#0B0F1A]">
                <Image
                  fill
                  src={owner?.profilePhoto?.url || '/default-profile.png'}
                  alt={owner?.username}
                  className="object-cover transition-transform duration-500 group-hover/header:scale-110"
                />
              </div>
            </motion.div>
            {/* Online Indicator if possible, or just verified ring */}
          </Link>
        </UserHoverCard>

        {/* Identity & Metadata - Refined Hierarchy */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center flex-wrap gap-x-1 sm:gap-x-2">
            <UserHoverCard userSelected={owner}>
              <Link
                href={userProfileLink}
                className="text-gray-900 dark:text-white font-black text-[13px] sm:text-sm tracking-tight hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors truncate"
              >
                {owner?.username || 'Phantom'}
              </Link>
            </UserHoverCard>

            <div className="flex items-center gap-1 shrink-0">
              {owner?.isAccountWithPremiumVerify && (
                <HiBadgeCheck className="text-indigo-500 text-base sm:text-lg" title="Verified Asset" />
              )}
              <span className="text-[8px] sm:text-[9px] text-gray-400 dark:text-white/20 font-black uppercase tracking-[0.15em]">
                {formatRelativeTime(post?.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-white/40 truncate">
              @{owner?.profileName || owner?.username}
            </span>

            {isCommunityPost && (
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-1 h-1 bg-indigo-500/50 rounded-full" />
                <span className="text-[8px] sm:text-[9px] font-black text-indigo-500/80 dark:text-indigo-400/80 uppercase tracking-widest bg-indigo-500/5 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-full border border-indigo-500/10">
                  Community
                </span>
              </div>
            )}

            {post?.source && (
              <div className="flex items-center gap-1 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                via <BsLink45Deg />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options Menu - Tactical Button */}
      {isLogin && (
        <div className="relative shrink-0">
          <motion.button
            ref={triggerRef}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleMenu}
            className={`
              w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center 
              text-gray-400 dark:text-white/30 hover:text-gray-900 dark:hover:text-white 
              transition-all border border-gray-100 dark:border-white/5
              ${showMenu ? 'bg-gray-100 dark:bg-white/10 ring-2 ring-indigo-500/10' : 'bg-transparent'}
            `}
          >
            <BsThreeDots className="text-base sm:text-lg" />
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <PostMenu
                post={post}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                triggerRef={triggerRef}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});

PostHeader.displayName = 'PostHeader';
export default PostHeader;
