'use client'
import React, { useMemo } from 'react'
import SluchitEntry from './SluchitEntry'
import { usePost } from '../Context/PostContext'
import { useAuth } from '../Context/AuthContext'
import PostSkeleton from '../Skeletons/PostSkeleton'

const Sluchits = () => {
  const { posts, isLoading } = usePost()
  const { user } = useAuth()
  const following = user?.following

  // Memoized sorted posts for performance
  const sortedPosts = useMemo(() => {
    return posts
      ?.slice()
      ?.sort((a, b) => {
        const isAFollowed = following?.includes(a?.owner?._id)
        const isBFollowed = following?.includes(b?.owner?._id)

        if (isAFollowed && !isBFollowed) return -1
        if (!isAFollowed && isBFollowed) return 1

        return new Date(b?.createdAt) - new Date(a?.createdAt)
      })
  }, [posts, following])

  return (
    <div className="w-full flex flex-col gap-6 px-4 md:px-6 lg:px-8">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} className="animate-pulse" />
        ))
      ) : sortedPosts?.length > 0 ? (
        sortedPosts.map((post) => <SluchitEntry key={post?._id} post={post} />)
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10 text-sm">
          No posts available
        </p>
      )}
    </div>
  )
}

export default Sluchits
