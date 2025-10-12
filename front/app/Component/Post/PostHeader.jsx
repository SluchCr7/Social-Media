'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BsThreeDots } from 'react-icons/bs'
import { HiBadgeCheck } from 'react-icons/hi'
import PostMenu from '@/app/Component/PostMenu'
import UserHoverCard from '../UserHoverCard'

const PostHeader = ({ post, user, isLogin, showMenu, setShowMenu,isCommunityPost }) => {
  return (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1">
                    
                    <UserHoverCard userSelected={post?.owner}>
                      <Link
                        href={user?._id === post?.owner?._id ? '/Pages/Profile' : `/Pages/User/${post?.owner?._id}`}
                        className="text-lightMode-fg dark:text-darkMode-fg font-semibold text-sm hover:underline truncate max-w-[150px] sm:max-w-[200px]"
                      >
                        {post?.owner?.username}
                      </Link>
                    </UserHoverCard>
                    {post?.owner?.isAccountWithPremiumVerify && (
                      <HiBadgeCheck className="text-blue-500 text-lg sm:text-xl" title="Verified" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    <span className="truncate max-w-[120px]">{post?.owner?.profileName}</span>
                    <span className="hidden sm:inline w-1 h-1 bg-gray-400 rounded-full" />
                    <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* 📋 Menu */}
              {isLogin && (
                <div className="relative self-end sm:self-auto">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                      text-xl text-gray-500 hover:text-gray-700 transition"
                  >
                    <BsThreeDots />
                  </button>
                  <PostMenu post={post} showMenu={showMenu} setShowMenu={setShowMenu} />
                </div>
              )}
            </div>
  )
}

export default PostHeader
