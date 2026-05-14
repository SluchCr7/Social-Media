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
const PostHeader = memo(({ post, user, isLogin, showMenu, setShowMenu, isCommunityPost, hideAvatar = false }) => {
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
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {/* User Avatar - Premium Frame */}
        {!hideAvatar && (
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
            </Link>
          </UserHoverCard>
        )}

        {/* Identity & Metadata - Refined Hierarchy */}
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <UserHoverCard userSelected={owner}>
                <Link
                  href={userProfileLink}
                  className="text-gray-900 dark:text-white font-bold text-[14px] sm:text-[15px] tracking-tight hover:underline transition-all truncate"
                >
                  {owner?.username || 'Phantom'}
                </Link>
              </UserHoverCard>

              {owner?.isAccountWithPremiumVerify && (
                <HiBadgeCheck className="text-indigo-500 text-base" title="Verified" />
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] font-medium text-gray-400 dark:text-white/30 truncate">
                @{owner?.profileName || owner?.username}
              </span>
              
              {isCommunityPost && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-1 h-1 bg-indigo-500/50 rounded-full" />
                  <span className="text-[10px] font-bold text-indigo-500/80 dark:text-indigo-400/80 uppercase tracking-widest bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/10 scale-90">
                    Community
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[12px] text-gray-400 dark:text-white/20 font-medium">
              {formatRelativeTime(post?.createdAt)}
            </span>
            {post?.source && (
              <BsLink45Deg className="text-gray-300 dark:text-white/10" />
            )}
          </div>
        </div>
      </div>

      {/* Options Menu - Tactical Button */}
      {isLogin && (
        <div className="relative shrink-0 ml-2">
          <motion.button
            ref={triggerRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleMenu}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center 
              text-gray-400 dark:text-white/30 hover:text-gray-900 dark:hover:text-white 
              transition-all
              ${showMenu ? 'bg-gray-100 dark:bg-white/10' : 'bg-transparent'}
            `}
          >
            <BsThreeDots className="text-lg" />
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
