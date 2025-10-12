'use client'
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { usePost } from "@/app/Context/PostContext"
import { useAuth } from "@/app/Context/AuthContext"
import { useUser } from "../Context/UserContext"

export const useProfilePosts = (userId, pinsPosts = []) => {
  const { fetchUserPosts, userPosts, userHasMore } = usePost()
  const { getUserById } = useUser()

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ year: "all", month: "all", sort: "latest" })
  const [activeTab, setActiveTab] = useState("Posts")
  const loaderRef = useRef(null)

  // جلب بيانات اليوزر
  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getUserById(userId)
      .then(res => setUserData(res))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }, [userId])

  // أول تحميل للبوستات
  useEffect(() => {
    if (userData?._id) {
      setPage(1)
      fetchUserPosts(userData._id, 1, 10, true) // reset = true
    }
  }, [userData?._id])

  // Infinite Scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting && userHasMore && userData?._id) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchUserPosts(userData._id, nextPage, 10)
    }
  }, [page, userHasMore, userData?._id, fetchUserPosts])

  useEffect(() => {
    if (!loaderRef?.current) return
    const options = { root: null, rootMargin: "20px", threshold: 1.0 }
    const observer = new IntersectionObserver(handleObserver, options)
    observer.observe(loaderRef.current)
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [handleObserver])

  // دمج pinned + الباقي
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

  // استخراج السنوات
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
    loaderRef,
    userData,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    userHasMore
  }
}
