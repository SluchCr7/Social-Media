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

  // ترتيب البوستات
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

  // خلط البوستات مع suggestions
  const combinedItems = useMemo(() => {
    if (!Array.isArray(sortedPosts)) return []

    const items = []
    const userList = Array.isArray(suggestedUsers) ? suggestedUsers : []
    const communityList = Array.isArray(communities) ? communities : []

    sortedPosts.forEach((post, index) => {
      if (post) items.push({ type: 'post', data: post })

      // أولوية: المجتمعات عند 6، غير كده يجي الـ users عند 3
      if ((index + 1) % 6 === 0 && communityList.length > 0) {
        items.push({ type: 'community', data: communityList.slice(0, 5) })
      } else if ((index + 1) % 3 === 0 && userList.length > 0) {
        items.push({ type: 'user', data: userList.slice(0, 5) })
      }
    })

    return items
  }, [sortedPosts, suggestedUsers, communities])

  return (
    <div className="w-full flex flex-col gap-6">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} className="animate-pulse" />
        ))
      ) : combinedItems.length > 0 ? (
        combinedItems.map((item, i) => {
          if (item.type === 'post') return <SluchitEntry key={item.data._id} post={item.data} />
          return <SuggestionRow key={`suggestion-${i}`} type={item.type} data={item.data} />
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
