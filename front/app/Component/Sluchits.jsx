'use client'
import React, { useMemo } from 'react'
import SluchitEntry from './SluchitEntry'
import { usePost } from '../Context/PostContext'
import { useAuth } from '../Context/AuthContext'
import PostSkeleton from '../Skeletons/PostSkeleton'
import { useCommunity } from '../Context/CommunityContext'
import { SuggestionRow } from './SuggestedRow'

const Sluchits = () => {
  const { posts, isLoading } = usePost()
  const { user, suggestedUsers } = useAuth()
  const { communities } = useCommunity()

  const following = Array.isArray(user?.following) ? user.following : []
  const userId = user?._id

  // ترتيب البوستات: المتابعين أولًا
  const sortedPosts = useMemo(() => {
    if (!Array.isArray(posts)) return []
    return posts
      .slice()
      .sort((a, b) => {
        const isAFollowed = following.includes(a?.owner?._id)
        const isBFollowed = following.includes(b?.owner?._id)
        if (isAFollowed && !isBFollowed) return -1
        if (!isAFollowed && isBFollowed) return 1
        return new Date(b?.createdAt) - new Date(a?.createdAt)
      })
  }, [posts, following])

  // فلترة الـ suggestions قبل الدمج
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(suggestedUsers)) return []
    return suggestedUsers.filter(u => !following.includes(u._id)) // استبعد اللي متابعهم
  }, [suggestedUsers, following])

  const filteredCommunities = useMemo(() => {
    if (!Array.isArray(communities)) return []
    return communities.filter(c => !c.members?.includes(userId)) // استبعد اللي انا عضو فيها
  }, [communities, userId])

  // خلط البوستات مع suggestions
  const combinedItems = useMemo(() => {
    if (!Array.isArray(sortedPosts)) return []

    const items = []

    sortedPosts.forEach((post, index) => {
      if (post) items.push({ type: 'post', data: post })

      // اقتراح المستخدمين كل 5 منشورات
      if ((index + 1) % 5 === 0 && filteredUsers.length > 0) {
        items.push({ type: 'user', data: filteredUsers.slice(0, 3) })
      }
      // اقتراح المجتمعات كل 10 منشورات
      else if ((index + 1) % 10 === 0 && filteredCommunities.length > 0) {
        items.push({ type: 'community', data: filteredCommunities.slice(0, 3) })
      }
    })

    return items
  }, [sortedPosts, filteredUsers, filteredCommunities])

  return (
    <div className="w-full flex flex-col gap-8">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} className="animate-pulse" />
        ))
      ) : combinedItems.length > 0 ? (
        combinedItems.map((item, i) => {
          if (item.type === 'post') {
            return <SluchitEntry key={item.data._id} post={item.data} />
          }

          // --- النص التوضيحي قبل الـ Suggestions ---
          return (
            <div key={`suggestion-${i}`} className="flex flex-col gap-3 px-1">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                {item.type === 'user'
                  ? '✨ Suggested Users to Follow'
                  : '🌐 Discover New Communities'}
              </h2>
              <SuggestionRow type={item.type} data={item.data} />
            </div>
          )
        })
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10 text-sm">
          No posts available
        </p>
      )}
    </div>
  )
}

export default Sluchits
