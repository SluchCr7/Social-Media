'use client'
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useAuth } from '@/app/redux/hooks';
import {
  useGetPublicUserByUsernameQuery,
  useGetUserByIdQuery,
} from '@/app/redux/features/user/userApi';
import { useGetUserPostsInfiniteQuery } from '@/app/redux/features/posts/postsApi';

export const useProfilePosts = (userId, pinsPosts = [], lookupByUsername = false) => {
  const { user: currentUser } = useAuth()
  const isObjectId = typeof userId === 'string' && /^[a-f\d]{24}$/i.test(userId)
  let decodedUsername = userId
  if (lookupByUsername && typeof userId === 'string') {
    try {
      decodedUsername = decodeURIComponent(userId)
    } catch {
      decodedUsername = userId
    }
  }

  const usernameQuery = useGetPublicUserByUsernameQuery(decodedUsername, {
    skip: !lookupByUsername || !userId,
  })
  const idFallbackQuery = useGetUserByIdQuery(userId, {
    skip:
      !lookupByUsername ||
      !isObjectId ||
      usernameQuery.isLoading ||
      usernameQuery.isFetching ||
      Boolean(usernameQuery.currentData),
  })
  const idQuery = useGetUserByIdQuery(userId, {
    skip: lookupByUsername || !userId,
  })
  const userData = lookupByUsername
    ? usernameQuery.currentData || idFallbackQuery.currentData || null
    : idQuery.currentData || null
  const loading = !userId || (lookupByUsername
    ? usernameQuery.isLoading ||
      usernameQuery.isFetching ||
      (!usernameQuery.currentData && (idFallbackQuery.isLoading || idFallbackQuery.isFetching))
    : idQuery.isLoading || idQuery.isFetching)
  const error = lookupByUsername
    ? idFallbackQuery.error || usernameQuery.error
    : idQuery.error

  const userPostsQuery = useGetUserPostsInfiniteQuery({
    userId: userData?._id,
    viewerId: currentUser?._id || 'anonymous',
    limit: 10,
  }, { skip: !userData?._id })
  const {
    fetchNextPage: fetchNextUserPostsPage,
    hasNextPage: hasMoreUserPosts,
    isFetchingNextPage: isFetchingMoreUserPosts,
  } = userPostsQuery
  const userPosts = useMemo(
    () => userPostsQuery.data?.pages?.flatMap((page) => page?.posts || []) || [],
    [userPostsQuery.data]
  )

  const [filters, setFilters] = useState({ year: "all", month: "all", sort: "latest" })
  const [activeTab, setActiveTab] = useState("Posts")
  const loaderRef = useRef(null)

  // Infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting && hasMoreUserPosts && !isFetchingMoreUserPosts) {
      fetchNextUserPostsPage()
    }
  }, [
    fetchNextUserPostsPage,
    hasMoreUserPosts,
    isFetchingMoreUserPosts,
  ])

  useEffect(() => {
    const currentLoader = loaderRef?.current;
    if (!currentLoader) return
    const options = { root: null, rootMargin: "20px", threshold: 1.0 }
    const observer = new IntersectionObserver(handleObserver, options)
    observer.observe(currentLoader)
    return () => {
      observer.unobserve(currentLoader)
    }
  }, [handleObserver])

  // Merge pinned posts with the paginated list.
  const combinedPosts = useMemo(() => {
    if (!userPosts && !userData?.pinsPosts) return []

    const pins = (userData?.pinsPosts || []).map(p => ({ ...p, isPinned: true }))
    const pinnedIds = new Set(pins.map(p => p._id))

    const regularPosts = (userPosts || []).map(p => ({
      ...p,
      isPinned: pinnedIds.has(p._id)
    }))

    const all = [...pins, ...regularPosts.filter(p => !pinnedIds.has(p._id))]

    return all.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [userPosts, userData?.pinsPosts])

  const postYears = useMemo(() => {
    if (!combinedPosts || combinedPosts?.length === 0) return []
    const yearsSet = new Set(
      combinedPosts?.map((p) => new Date(p.createdAt).getFullYear().toString())
    )
    return Array.from(yearsSet).sort((a, b) => b - a)
  }, [combinedPosts])

  return {
    combinedPosts,
    postYears,
    loading,
    postsLoading: userPostsQuery.isLoading || userPostsQuery.isFetchingNextPage,
    error,
    loaderRef,
    userData,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    userHasMore: Boolean(userPostsQuery.hasNextPage)
  }
}
