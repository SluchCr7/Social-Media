'use client'
import React, { memo, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsThreeDots } from 'react-icons/bs'
import { HiBadgeCheck } from 'react-icons/hi'
import PostMenu from '@/app/Component/PostMenu'
import UserHoverCard from '../UserHoverCard'
import { formatRelativeTime } from '@/app/utils/FormatDataCreatedAt'

const PostHeader = memo(({ post, user, isLogin, showMenu, setShowMenu, isCommunityPost }) => {
  const owner = post?.owner
  const triggerRef = useRef(null)

  // ✅ useCallback لتجنب إعادة إنشاء الدالة في كل رندر
  const handleToggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev)
  }, [setShowMenu])

  // ✅ روابط المستخدم
  const userProfileLink = user?._id === owner?._id
    ? '/Pages/Profile'
    : `/Pages/User/${owner?._id}`

  return (
    <div className="flex flex-row justify-between items-center gap-2">

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1">
          <UserHoverCard userSelected={owner}>
            <Link
              href={userProfileLink}
              className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline truncate max-w-[150px] sm:max-w-[200px]"
            >
              {owner?.username}
            </Link>
          </UserHoverCard>
          {owner?.isAccountWithPremiumVerify && (
            <HiBadgeCheck
              className="text-blue-500 text-lg sm:text-xl shrink-0"
              title="Verified"
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          {owner?.profileName && (
            <span className="truncate max-w-[120px]">{owner.profileName}</span>
          )}
          <span className="hidden sm:inline w-1 h-1 bg-gray-400 rounded-full" />
          <span>{formatRelativeTime(post?.createdAt)}</span>
        </div>
      </div>

      {/* 📋 قائمة الخيارات */}
      {isLogin && (
        <div className="relative">
          <button
            ref={triggerRef}
            onClick={handleToggleMenu}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
              text-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            aria-label="Post options"
          >
            <BsThreeDots />
          </button>

          {/* قائمة المنشور */}
          <PostMenu
            post={post}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            triggerRef={triggerRef}
          />
        </div>
      )}
    </div>
  )
})
PostHeader.displayName = 'PostHeader'
export default PostHeader
